/**
 * Google Apps Script - PLC Training Suite Auth & Data Sync
 * 
 * Script ini menangani:
 * 1. Request Kode OTP via Email (action: 'request_otp')
 * 2. Verifikasi Kode OTP (action: 'verify_otp')
 * 3. Log Pendaftaran & Login Pengguna di Google Sheets
 */

// Nama Sheet di Google Spreadsheet
var SHEET_USERS = "Users";
var SHEET_OTP = "OTP";

/**
 * Memproses permintaan HTTP POST dari Web App
 */
function doPost(e) {
  try {
    var data = {};
    if (e && e.postData && e.postData.contents) {
      data = JSON.parse(e.postData.contents);
    }
    
    var action = data.action || data.type;
    var result = { success: false, message: "Action tidak dikenal" };
    
    if (action === "request_otp") {
      result = handleRequestOtp(data);
    } else if (action === "verify_otp") {
      result = handleVerifyOtp(data);
    } else if (action === "registration" || action === "quiz_result") {
      result = handleLegacySync(data);
    }
    
    return createJsonResponse(result);
  } catch (error) {
    return createJsonResponse({
      success: false,
      message: "Terjadi kesalahan server: " + error.toString()
    });
  }
}

/**
 * Memproses permintaan HTTP GET (opsional / tes server)
 */
function doGet(e) {
  return createJsonResponse({
    status: "active",
    message: "PLC Training Suite Google Apps Script Server is Running",
    timestamp: new Date().toISOString()
  });
}

/**
 * 1. Handle Request OTP: Generate 6 digit OTP & Kirim Email
 */
function handleRequestOtp(data) {
  var email = (data.email || "").trim().toLowerCase();
  var name = (data.name || "").trim();
  
  if (!email) {
    return { success: false, message: "Email wajib diisi!" };
  }
  
  // Generate 6 digit angka OTP
  var otpCode = Math.floor(100000 + Math.random() * 900000).toString();
  var now = new Date();
  // Waktu expired OTP: 10 Menit dari sekarang
  var expiryTime = new Date(now.getTime() + 10 * 60 * 1000);
  
  // Simpan OTP ke Sheet "OTP"
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var otpSheet = getOrCreateSheet(ss, SHEET_OTP, ["Email", "OTP", "ExpiryTime", "CreatedAt"]);
  
  // Cari apakah email sudah ada record OTP, jika ada update row tersebut
  var dataRange = otpSheet.getDataRange().getValues();
  var rowIndexToUpdate = -1;
  for (var i = 1; i < dataRange.length; i++) {
    if (dataRange[i][0].toString().toLowerCase() === email) {
      rowIndexToUpdate = i + 1; // 1-indexed row number
      break;
    }
  }
  
  if (rowIndexToUpdate > 0) {
    otpSheet.getRange(rowIndexToUpdate, 2, 1, 3).setValues([[
      otpCode,
      expiryTime.toISOString(),
      now.toISOString()
    ]]);
  } else {
    otpSheet.appendRow([email, otpCode, expiryTime.toISOString(), now.toISOString()]);
  }
  
  // Kirim Email OTP ke User
  var subject = "🔑 Kode OTP Login PLC Training Suite: " + otpCode;
  var htmlBody = `
    <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #0f172a; color: #f8fafc;">
      <div style="text-align: center; padding-bottom: 15px; border-bottom: 2px solid #ea580c;">
        <h2 style="color: #ea580c; margin: 0; font-size: 24px; font-weight: 800;">PLC TRAINING SUITE</h2>
        <p style="color: #94a3b8; margin: 4px 0 0 0; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Industrial Automation LMS</p>
      </div>
      <div style="padding: 25px 10px; text-align: center;">
        <p style="font-size: 16px; margin-bottom: 8px;">Halo <strong>${name || 'Teknisi'}</strong>,</p>
        <p style="color: #cbd5e1; font-size: 14px; margin-bottom: 20px;">Gunakan kode OTP di bawah ini untuk verifikasi masuk ke sistem:</p>
        <div style="background-color: #1e293b; color: #f97316; font-size: 36px; font-weight: 900; letter-spacing: 8px; padding: 16px 24px; border-radius: 10px; display: inline-block; border: 1px dashed #ea580c;">
          ${otpCode}
        </div>
        <p style="color: #64748b; font-size: 12px; margin-top: 20px;">Kode ini hanya berlaku selama <strong>10 menit</strong>.<br>Jangan bagikan kode ini kepada siapa pun.</p>
      </div>
      <div style="text-align: center; border-top: 1px solid #334155; padding-top: 15px; color: #64748b; font-size: 11px;">
        &copy; ${now.getFullYear()} PLC Training Suite - Industrial Controls LMS
      </div>
    </div>
  `;
  
  try {
    MailApp.sendEmail({
      to: email,
      subject: subject,
      htmlBody: htmlBody
    });
    return { success: true, message: "Kode OTP telah dikirim ke email " + email };
  } catch (emailErr) {
    return { success: false, message: "Gagal mengirim email OTP: " + emailErr.toString() };
  }
}

/**
 * 2. Handle Verify OTP: Cek OTP & Catat User di Sheet "Users"
 */
function handleVerifyOtp(data) {
  var email = (data.email || "").trim().toLowerCase();
  var otpInput = (data.otp || "").trim();
  var name = (data.name || "").trim();
  var whatsapp = (data.whatsapp || "").trim();
  
  if (!email || !otpInput) {
    return { success: false, message: "Email dan Kode OTP wajib diisi!" };
  }
  
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var otpSheet = ss.getSheetByName(SHEET_OTP);
  if (!otpSheet) {
    return { success: false, message: "Belum ada kode OTP yang dikirim ke email ini." };
  }
  
  var dataRange = otpSheet.getDataRange().getValues();
  var matchIndex = -1;
  var validOtp = "";
  var expiryStr = "";
  
  for (var i = 1; i < dataRange.length; i++) {
    if (dataRange[i][0].toString().toLowerCase() === email) {
      matchIndex = i + 1;
      validOtp = dataRange[i][1].toString().trim();
      expiryStr = dataRange[i][2].toString();
      break;
    }
  }
  
  if (matchIndex < 0) {
    return { success: false, message: "Email tidak ditemukan atau OTP belum dikirim." };
  }
  
  // Cek apakah OTP cocok
  if (validOtp !== otpInput) {
    return { success: false, message: "Kode OTP salah! Silakan periksa kembali email Anda." };
  }
  
  // Cek apakah waktu expired sudah lewat
  var expiryTime = new Date(expiryStr);
  var now = new Date();
  if (now.getTime() > expiryTime.getTime()) {
    return { success: false, message: "Kode OTP sudah kedaluwarsa. Silakan minta kode baru." };
  }
  
  // OTP Valid -> Hapus record OTP dari sheet agar tidak bisa dipakai ulang
  otpSheet.deleteRow(matchIndex);
  
  // Catat / Update User di Sheet "Users"
  var usersSheet = getOrCreateSheet(ss, SHEET_USERS, ["Timestamp", "Name", "Email", "WhatsApp", "Role", "LastLogin"]);
  var userDataRange = usersSheet.getDataRange().getValues();
  var userRowToUpdate = -1;
  
  for (var j = 1; j < userDataRange.length; j++) {
    if (userDataRange[j][2].toString().toLowerCase() === email) {
      userRowToUpdate = j + 1;
      break;
    }
  }
  
  var timestampStr = now.toISOString();
  if (userRowToUpdate > 0) {
    // Update nama, whatsapp, last login
    if (name) usersSheet.getRange(userRowToUpdate, 2).setValue(name);
    if (whatsapp) usersSheet.getRange(userRowToUpdate, 4).setValue(whatsapp);
    usersSheet.getRange(userRowToUpdate, 6).setValue(timestampStr);
  } else {
    // Append user baru
    usersSheet.appendRow([timestampStr, name || "User", email, whatsapp || "-", "Student", timestampStr]);
  }
  
  return {
    success: true,
    message: "Verifikasi OTP berhasil!",
    user: {
      name: name || "User",
      email: email,
      whatsapp: whatsapp || ""
    }
  };
}

/**
 * 3. Legacy Sync (pendaftaran awal/quiz)
 */
function handleLegacySync(data) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var usersSheet = getOrCreateSheet(ss, SHEET_USERS, ["Timestamp", "Name", "Email", "WhatsApp", "Role", "LastLogin"]);
  
  usersSheet.appendRow([
    new Date().toISOString(),
    data.name || data.userName || "User",
    data.email || "-",
    data.company || "-",
    data.role || "Student",
    new Date().toISOString()
  ]);
  
  return { success: true, message: "Data berhasil disinkronisasi." };
}

/**
 * Helper: Ambil atau buat Sheet jika belum ada
 */
function getOrCreateSheet(ss, sheetName, headers) {
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
    if (headers && headers.length > 0) {
      sheet.appendRow(headers);
      sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold").setBackground("#e2e8f0");
    }
  }
  return sheet;
}

/**
 * Helper: Buat HTTP Output JSON
 */
function createJsonResponse(jsonObject) {
  return ContentService.createTextOutput(JSON.stringify(jsonObject))
    .setMimeType(ContentService.MimeType.JSON);
}
