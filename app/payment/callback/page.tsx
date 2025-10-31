// app/api/payment/callback/route.ts
// (File này xác nhận thanh toán an toàn từ Server VNPAY)

import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import qs from 'qs';

// --- KHU VỰC HARDCODE ---
// ⚠️ Cảnh báo: KHÔNG an toàn! Phải giống hệt file create.
const VNPAY_HASH_SECRET = "YOUR_HASH_SECRET_HERE"; // Thay mã bí mật của bạn
// -----------------------

// Hàm sắp xếp
function sortObject(obj: any) {
  let sorted: any = {};
  let str = [];
  let key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      str.push(encodeURIComponent(key));
    }
  }
  str.sort();
  for (key = 0; key < str.length; key++) {
    sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
  }
  return sorted;
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    let vnp_Params: any = {};
    
    searchParams.forEach((value, key) => {
      vnp_Params[key] = value;
    });

    const secretKey = VNPAY_HASH_SECRET; // Dùng biến hardcoded

    const vnp_SecureHash = vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHash'];
    delete vnp_Params['vnp_SecureHashType'];

    vnp_Params = sortObject(vnp_Params);

    // Tạo lại chữ ký
    const signData = qs.stringify(vnp_Params, { encode: false });
    const hmac = crypto.createHmac("sha52", secretKey);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");

    const vnp_ResponseCode = vnp_Params['vnp_ResponseCode'];
    const vnp_TxnRef = vnp_Params['vnp_TxnRef'];

    // Kiểm tra chữ ký
    if (vnp_SecureHash === signed) {
      if (vnp_ResponseCode === '00') {
        
        // ---- CẬP NHẬT DATABASE CỦA BẠN TẠI ĐÂY ----
        // Đây là nơi duy nhất xác nhận thanh toán thành công
        // Ví dụ: await updateOrderAsPaid(vnp_TxnRef);
        // ------------------------------------------

        console.log(`[VNPAY IPN] Thanh cong cho don hang: ${vnp_TxnRef}`);
        return NextResponse.json({ RspCode: '00', Message: 'Success' });
      } else {
        console.log(`[VNPAY IPN] That bai cho don hang: ${vnp_TxnRef}`);
        return NextResponse.json({ RspCode: '00', Message: 'Success' });
      }
    } else {
      console.error(`[VNPAY IPN] Loi: Chu ky khong hop le`);
      return NextResponse.json({ RspCode: '97', Message: 'Invalid Checksum' });
    }
  } catch (error) {
    console.error('[VNPAY IPN] Loi he thong:', error);
    return NextResponse.json({ RspCode: '99', Message: 'Unknown error' });
  }
}