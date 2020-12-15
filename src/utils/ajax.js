import axios from 'axios';
import NProgress from 'nprogress';
import JSONbig from 'json-bigint';
import message from 'ant-design-vue/es/message';
import * as api from '@/api/login';
import QS from 'qs';

let BASEURL = '';
if (process.env.NODE_ENV === 'development') {
    BASEURL = '/';
    // BASEURL = "http://dev.linli580.com:10000/";
} else {
    BASEURL = location.origin;
}

const JSONBigString = JSONbig({ storeAsString: true });
export const HTTP = axios.create({
    baseURL: BASEURL,
    withCredentials: true,
    timeout: 20000,
    headers: {
        // post: {
        //   'Content-Type': 'application/json'
        // }
    },
    transformResponse: [
        function(data) {
            return JSONBigString.parse(data);
        }
    ]
});

//请求拦截
HTTP.interceptors.request.use(async config => {
    NProgress.start();

    // //login走这个ajax
    // if (config.url.indexOf('/times/auth/oauth/token') >= 0 || config.url.indexOf('/verifycode/api/v1/send') >= 0) {
    //   let tokenStr = '';
    //   config.headers.Authorization = tokenStr;
    //   return config;
    // } else {
    //   if (config.url.indexOf('/times/pub-center/qr-code/api/v1/qr/insert') >= 0) {
    //     config.headers.program_code = 'app_notice';
    //   }
    //   let tokenStr = 'Bearer ' + localStorage.getItem('SD_ACCESS_TOKEN');
    //   console.log(tokenStr);
    //   config.headers.Authorization = tokenStr;
    //   return config;
    // }

    // 非login走这个ajax
    let tokenStr =
        'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX25hbWUiOiJhZG1pbiIsInNjb3BlIjpbImFsbCJdLCJpZCI6MSwiZXhwIjoxNjA4MDY4NzQzLCJhdXRob3JpdGllcyI6WyJhcHBfYWN0aXZpdHlfYWRtaW4iLCJhcHBfcXVhbGl0eV9hZG1pbiIsImFwcF9ob3VzZV9hZG1pbiIsImFwcF92aXNpdG9yX2FkbWluIiwic3lzX2FkbWluIiwiYXBwX2RldmljZV9hZG1pbiIsImFwcF9hZHZlcnRfYWRtaW4iLCJhcHBfbm90aWNlX2FkbWluIiwiYXBwX21pY3JvX2FkbWluIiwiYXBwX2FyZWFfYWRtaW4iLCJhcHBfYWlfYWRtaW4iLCJhcHBfZGVjb3JhdGVfYWRtaW4iLCJhcHBfdmVoaWNsZV9hZG1pbiIsImFwcF9hcmVhX2VtcF9hZG1pbiIsImFwcF9wYXNzYWdlX2FkbWluIiwiYW55dGltZXMiLCJhcHBfdXNlcl9hZG1pbiIsImFwcF9zcGFjZV9hZG1pbiIsImFwcF9vd25lcl9hZG1pbiIsImFwcF9jb21wYW55X2xpYl9hZG1pbiIsImFwcF9hZG1pbiJdLCJqdGkiOiIyNDJjOGNhYS02YmU4LTQ5OWYtYjI5Ny0zMjVhNzEwY2UxZGUiLCJjbGllbnRfaWQiOiJ3ZWJfYiJ9.WgYr5lRJ7-10vuu0iSU5yQr1kbFhVNtmOglMVHCXC2_IyKaWNW8dcUAU7Jr-CKBwkJ97u5x6dyXVzmBKrmP5GAxXplEdLFxbSLE_inyCP_b8UtKj5gwWo3-OXXGQd_az-3gY8UWdjapGwXq3ASxvFoZmEsDXq9IsxRdP2NoL7dx4wpxtQNBNt2VsdYhzGPzxjH82-UqRbZi5l_vKJuqO1jGTLQhNOYFMqkLe7QQgcBqJzgoDoQd_FuLWT_agFxEiOBn92RKaxG9oDJ8EB8lBJB3AhKJBkdoZRvEf5MXCzz8_PF2z4V-e1uePXZF46Pt36596daxP4pAVv9WYdZMxiA';
    console.log(tokenStr);
    config.headers.Authorization = tokenStr;
    return config;

    // if (process.env.NODE_ENV === 'development') {
    //   // tokenStr = `bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1OTQ4NzA1NTIsInVzZXJfbmFtZSI6IjAwZGM1MzMxMmIwMDAwMDAiLCJhdXRob3JpdGllcyI6WyIiLCJTRVRUTEVEX09QX1VTRVJfSU1QT1JUIiwiV09SS09SREVSX09QX0JVU0lORVNTX1JFQ09SRFJFU1VMVCIsIkdST1VQXzAwMDAwMDAwMDAwMDA1MDAiLCJTUEFDRV9NRU5VX0JBVENIX0lNUE9SVCIsIkVOVEVSX1dFQl9BQ0NFU1MiLCJXT1JLT1JERVJfTUVOVV9BUFBfQl9CVVNJTkVTUyIsIkVOVEVSX1dFQl9BQ0NFU1NfQ09OVFJPTF9NQU5BR0VSIiwiRU5URVJfV0VCX05PVElDRV9NQU5BR0VSIiwiR1JPVVBfMDAwMDAwMDAwMDAwMjgwMCIsIldPUktPUkRFUl9PUF9CVVNJTkVTU19DUkVBVEUiLCJXT1JLT1JERVJfT1BfQlVTSU5FU1NfQ19DUkVBVEUiLCJFTlRFUlBSSVNFX09QX0lORk9fQUREIiwiRU5URVJfV0VCX0lOVEVMTElHRU5UX1BPUlRBTF9NQU5BR0VSIiwiRU1QTE9ZRUVfT1BQX09OTElORSIsIklOU1BFQ1RfTUVOVV9UQVNLTUFOQUdFIiwiQlVMTEVUSU5fQVBQX01FTlVfTElTVCIsIlBPTElDWV9NRU5VX1ZJRVciLCJFTlRFUl9XRUJfUVVFU1RJT05OQUlSRV9NQU5BR0VSIiwiRU5URVJfV0VCX1JFUEFJUl9NQU5BR0VSIiwiVklTSVRPUl9BUFBfUkVHSVNURVIiLCJHUk9VUF8wMDAwMDAwMDAwMDAxNzAwIiwiRU5URVJfV0VCX0ZPUlVNX01BTkFHRVIiLCJTVE9DS19SRU5UX1JFRFVDVElPTl9MSVNUIiwiR1JPVVBfMDAwMDAwMDAwMDAwMjAwMCIsIkVETV9PUF9SRVBMWSIsIldPUktPUkRFUl9PUF9DQVRFR09SWV9DVUQiLCJGT1JVTV9NRU5VX1BPU1RfQ0hFQ0siLCJGT1JVTV9PUF9BUFBfQ19SRVBMSUVTIiwiUEFUUk9MX09QX1RBU0tfRVhFQ1VURSIsIkVETV9NRU5VX01BTkFHRSIsIkVOVEVSX0FQUF9TV0VFUENPREUiLCJBQ1RJVklUWV9BUFBfTUVOVV9WSUVXX0FDVElWSVRZIiwifuWPlua2iOWcuuWcsOmihOe6puadg-mZkCIsIkFEX09QX01BTkFHRSIsIkVOVEVSUFJJU0VfTUVOVV9ERVBBUlRNRU5UX0FORF9TVEFGRl9MSVNUIiwiQ1JFREVOVElBTFNfT1BfRVhJVF9BUFBST1ZBTF9FTlRFUlBSSVNFIiwiR1JPVVBfMDAwMDAwMDAwMDAwMDQwMCIsIkdST1VQXzAwMDAwMDAwMDAwMDMwMDAiLCJWSVNJVE9SX1NFVFRJTkciLCJJTlNQRUNUX09QX0NIRUNLUE9JTlRfQ1JFQVRFIiwiR1JPVVBfMDAwMDAwMDAwMDAwMjcwMCIsIlBBVFJPTF9NRU5VX1JPVVRFX01BTkFHRSIsIkZPUlVNX01FTlVfTEFCRUxfTUFOQUdFIiwiU0VUVExFRF9NRU5VX1VTRVJfU0VUVExFRF9MSVNUIiwiUFJPSkVDVF9PUF9QUk9KRUNUX0FERCIsIlNUT0NLX0FERF9QUk9KRUNUX0NPTkZJR19NQU5BR0VSIiwiR1JPVVBfMDAwMDAwMDAwMDAwMTYwMCIsIlBPTElDWV9NRU5VX1NFVFRJTkciLCJGT1JVTV9PUF9BUFBfQ19MSUtFIiwiUExBQ0VfQVBQX09QX01ZX0NBTkNFTFMiLCJJTlNQRUNUX01FTlVfQ0hFQ0tQT0lOVF9NQU5BR0UiLCJXT1JLT1JERVJfTUVOVV9TVEFUSVNUSUNTIiwiUE9MSUNZX0FQUF9NRU5VX0xJU1QiLCJXT1JLT1JERVJfTUVOVV9CVVNJTkVTUyIsIkVOVEVSX1dFQl9FTlRFUlBSSVNFX01BTkFHRVIiLCJFTlRFUl9XRUJfUE9MSUNZX0NPTlNVTFRBVElPTiIsIkNSRURFTlRJQUxTX01FTlVfUEFSS0lOR19DIiwiQUNDRVNTX01FTlVfQVBQX0MiLCJSRU5UX1JFRFVDVElPTl9BUFBMWSIsIldPUktPUkRFUl9NRU5VX1JFR0lPTiIsIkVETV9PUF9NQU5BR0UiLCJHUk9VUF8wMDAwMDAwMDAwMDAwNzAwIiwiUExBQ0VfTUVOVV9MSVNUX0MiLCJDUkVERU5USUFMU19PUF9QQVJLSU5HX0FQUFJPVkFMX1BST1BFUlRZIiwiUEFUUk9MX09QX1JPVVRFX0NSRUFURSIsIkdST1VQXzAwMDAwMDAwMDAwMDEwMDAiLCJHUk9VUF8wMDAwMDAwMDAwMDAyMjAwIiwiQlVMTEVUSU5fT1BfUFVCTElTSCIsIkNSRURFTlRJQUxTX09QX0hPVF9BUFBST1ZBTF9QUk9QRVJUWSIsIkZPUlVNX09QX0xBQkVMX0NVIiwiUVVFU1RJT05OQUlSRV9PUF9RVUVTVElPTk5BSVJFX0NSRUFURSIsIkFDQ0VTU19NRU5VX1dFQl9ISVNUT1JZIiwiUExBQ0VfT1BfU1RPUCIsIkFDQ0VTU19VUExBREVfRkFDRV9JTUciLCJHUk9VUF8wMDAwMDAwMDAwMDAxOTAwIiwiRU5URVJfV0VCX1NFVFRMRURfTUFOQUdFUiIsIlBST0pFQ1RfTUVOVV9QUk9KRUNUX0xJU1QiLCJHUk9VUF8wMDAwMDAwMDAwMDAxMTAwIiwiRk9SVU1fT1BfUkVQTElFU19ERUxFVEUiLCJGT1JVTV9PUF9BUFBfQ19SRVBMWSIsIlNFVFRMRURfTUVOVV9VU0VSX0JBVENIX0lNUE9SVCIsIkNSRURFTlRJQUxTX09QX1BBUktJTkdfQVBQUk9WQUxfRU5URVJQUklTRSIsIkZPUlVNX09QX0FQUF9DX1NFTEZfUE9TVF9ERUxFVEUiLCJFTlRFUl9XRUJfUExBQ0VfTUFOQUdFUiIsIlBMQUNFX01FTlVfUkVTRVJWRV9DIiwiUExBQ0VfTUVOVV9MSVNUIiwiR1JPVVBfMDAwMDAwMDAwMDAwMDYwMCIsIldPUktPUkRFUl9PUF9CVVNJTkVTU19FVkFMVUFURSIsIkNSRURFTlRJQUxTX09QX0VYSVRfQyIsIkdST1VQXzAwMDAwMDAwMDAwMDMyMDAiLCJQT0xJQ1lfT1BfU0VUVElORyIsIkFDQ0VTU19BRERfV0VCX1VTRVIiLCJFTlRFUl9XRUJfTUFUQ0hfTUFOQUdFUiIsIlBBVFJPTF9PUF9UQVNLX0NSRUFURSIsIlNFVFRMRURfTUVOVV9FTlRFUlBSSVNFX1NFVFRMRURfTElTVCIsIkdST1VQXzAwMDAwMDAwMDAwMDI5MDAiLCJBQ0NFU1NfUkVDT1JEUyIsIkFDVElWSVRZX01FTlVfTElTVF9DIiwiRU5URVJfV0VCX0pPSU5fUVVFU1RJT05OQUlSRSIsIkVNUExPWUVFX01FTlVfVEFHIiwiQUNDRVNTX0FERF9XRUJfRE9PUiIsIlBMQUNFX09QX0JBQ0tfQyIsIkFEX01FTlVfTUFOQUdFIiwifuafpeeci-eUteWtkOelqOadg-mZkCIsIldPUktPUkRFUl9PUF9CVVNJTkVTU19UUkFOU0ZFUiIsIkZPUlVNX09QX1BPU1RfREVMRVRFIiwiQlVMTEVUSU5fT1BfVE9QIiwiR1JPVVBfMDAwMDAwMDAwMDAwMTgwMCIsIlNFVFRMRURfT1BfVVNFUl9BVVRPX1NFVFRMRURfQUREIiwiV09SS09SREVSX01FTlVfQlVTSU5FU1NfQyIsIkVOVEVSX1dFQl9DVVNUT01FUl9TRVJWSUNFX01BTkFHRVIiLCJBQ1RJVklUWV9PUF9BREQiLCJHUk9VUF8wMDAwMDAwMDAwMDAyMTAwIiwiRk9SVU1fT1BfQVBQX0NfU0VMRl9SRVBMSUVTX0RFTEVURSIsIkVOVEVSX1dFQl9BQ1RJVklUWV9NQU5BR0VSIiwiQlVMTEVUSU5fT1BfQ09NUEFOWSIsIkVNUExPWUVFX01FTlVfSk9CIiwiV09SS09SREVSX09QX1JFTUlOREVSX0NVRCIsIkFDVElWSVRZX01FTlVfTElTVCIsIkVOVEVSX1dFQl9DRVJUSUZJQ0FURVNfTUFOQUdFUiIsIlBMQUNFX09QX0FERCIsIldPUktPUkRFUl9PUF9CVVNJTkVTU19BQ0NFUFRBTkNFIiwiUkVOVF9SRURVQ1RJT05fTElTVCIsIkNSRURFTlRJQUxTX01FTlVfQyIsIkNSRURFTlRJQUxTX01FTlVfQiIsIkdST1VQXzAwMDAwMDAwMDAwMDA5MDAiLCJQTEFDRV9PUF9BQ1RJVkFURSIsIkVOVEVSX1dFQl9QQVJLX0FDVElWSVRZX01BTkFHRVIiLCJXT1JLT1JERVJfTUVOVV9SRU1JTkRFUiIsIkVOVEVSX1dFQl9QQVJLX05PVElDRV9NQU5BR0VSIiwiV09SS09SREVSX09QX0JVU0lORVNTX1ZJU0lUIiwiR1JPVVBfMDAwMDAwMDAwMDAwMDEwMCIsIklOU1BFQ1RfT1BfVEVNUExBVEVfQ1JFQVRFIiwiU1BBQ0VfTUVOVV9TUEFDRV9MSVNUIiwiR1JPVVBfMDAwMDAwMDAwMDAwMjQwMCIsIklOU1BFQ1RfTUVOVV9DT05GSUciLCJDUkVERU5USUFMU19PUF9DT05TVFJVQ1RJT05fQVBQUk9WQUxfRU5URVJQUklTRSIsIlBMQUNFX0FQUF9NRU5VX1BMQUNFIiwiRU5URVJfV0VCX1BPTElDWV9NQU5BR0VSIiwiSU5TUEVDVF9NRU5VX1JFQ09SRCIsIlBBVFJPTF9NRU5VX1JFQ09SRCIsIlBMQUNFX0FQUF9PUF9SRVNFUlZFX1BMQUNFIiwiV09SS09SREVSX01FTlVfQVBQX0NfQlVTSU5FU1MiLCJFTVBMT1lFRV9PUFBfT0ZGTElORSIsIkVOVEVSUFJJU0VfTUVOVV9BUFBfRU5URVJQUklTRV9MSVNUIiwiR1JPVVBfMDAwMDAwMDAwMDAwMTMwMCIsIkZPUlVNX01FTlVfTUVTU0FHRSIsIklOU1BFQ1RfTUVOVV9URU1QTEFURV9NQU5BR0UiLCJQQVRST0xfTUVOVV9DT05GSUciLCJCVUxMRVRJTl9PUF9BREQiLCJFTVBMT1lFRV9PUFBfVE9QIiwiRU5URVJfV0VCX1NVUlZFSUxMQU5DRSIsIlBPTElDWV9NRU5VX1FVRVNUSU9OUyIsIkFDVElWSVRZX09QX1ZJRVdFTlJPTExFUk5VTSIsIkVNUExPWUVFX01FTlVfU0VUVElORyIsIkFEX09QX1FVRVJZIiwiR1JPVVBfMDAwMDAwMDAwMDAwMDgwMCIsIlBMQUNFX0FQUF9NRU5VX1ZJRVdfUkVTRVJWRSIsIlNFVFRMRURfT1BfRU5URVJQUklTRV9TRVRUTEVEX0FERCIsIkdST1VQXzAwMDAwMDAwMDAwMDAwMDIiLCJCVUxMRVRJTl9NRU5VX0xJU1QiLCJHUk9VUF8wMDAwMDAwMDAwMDAwMDAxIiwiV09SS09SREVSX09QX0JVU0lORVNTX0NMT1NFIiwiR1JPVVBfMDAwMDAwMDAwMDAwMjMwMCIsIklOU1BFQ1RfT1BfVEFTS19DUkVBVEUiLCJGT09UUEFUSF9NRU5VX0MiLCJBQ1RJVklUWV9BUFBfT1BfTVlfQ0FOQ0VMUyIsIkNSRURFTlRJQUxTX09QX0hPVF9BUFBST1ZBTF9FTlRFUlBSSVNFIiwiQ1JFREVOVElBTFNfT1BfSE9UX0MiLCJBQ0NFU1NfTUVOVV9TSE9XX0JVVFRPTiIsIkNSRURFTlRJQUxTX09QX0VYSVRfQVBQUk9WQUxfUFJPUEVSVFkiLCJQTEFDRV9BUFBfTUVOVV9NRUVUSU5HIiwiV09SS09SREVSX09QX1JFR0lPTl9DVUQiLCJGT1JVTV9PUF9BUFBfQ19QT1NUSU5HIiwiV09SS09SREVSX01FTlVfQ09ORklHIiwiU1BBQ0VfT1BfQkFUQ0hfSU1QT1JUIiwiQ1JFREVOVElBTFNfT1BfQ09OU1RSVUNUSU9OX0FQUFJPVkFMX1BST1BFUlRZIiwiUEFUUk9MX01FTlVfVEFTS01BTkFHRSIsIkdST1VQXzAwMDAwMDAwMDAwMDEyMDAiLCJFRE1fTUVOVV9MSVNUIiwiUExBQ0VfQVBQX09QX1JFU0VSVkVfTUVFVElORyIsIkFDVElWSVRZX09QX1ZJRVdBUlJJVkFMTlVNIiwiQUNUSVZJVFlfT1BfUFVCTElTSCIsIkFDVElWSVRZX0FQUF9NRU5VX0xJU1QiLCJFTlRFUl9XRUJfQUQiLCJJTlNQRUNUX09QX1RBU0tfRVhFQ1VURSIsIkVOVEVSX1dFQl9QTEFDRV9TVUJTQ1JJQkVfTUFOQUdFUiIsIlZJU0lUT1JfQVBQX0lOVklUQVRJT04iLCJGT1JVTV9NRU5VX0FQUF9DIiwiQ1JFREVOVElBTFNfT1BfUEFSS0lOR19DIiwiRU5URVJfV0VCX0RFUEFSVE1FTlRfQU5EX1NUQUZGX01BTkFHRVIiLCJGT1JVTV9NRU5VX0JBTk5FRF9NQU5BR0UiLCJDUkVERU5USUFMU19PUF9DT05TVFJVQ1RJT05fQyIsIn7lj5bmtojkvJrorq7lrqTpooTnuqbmnYPpmZAiLCJHUk9VUF8wMDAwMDAwMDAwMDAwMzAwIiwiRU1QTE9ZRUVfQVBQX01FTlVfTElTVCIsIkFDQ0VTU19BRERfV0VCX0RFVklDRSIsIkJVTExFVElOX09QX1JFVk9LRSIsIkdST1VQXzAwMDAwMDAwMDAwMDI2MDAiLCJQTEFDRV9PUF9DT05GSUdfVEVSTSIsIkJVTExFVElOX0FQUF9PUF9SRVBMWSIsIldPUktPUkRFUl9NRU5VX0NBVEVHT1JZIiwiU1BBQ0VfT1BfU1BBQ0VfQUREIiwiUE9MSUNZX09QX1RBR1MiLCJFTlRFUl9XRUJfQ0VSVElGSUNBVEVTX09QRVJBVEUiLCJFTlRFUlBSSVNFX09QX0RFU0NSSVBUSU9OX0FERCIsIlZJU0lUT1JfV0VCX0xJU1QiLCJHUk9VUF8wMDAwMDAwMDAwMDAxNTAwIiwiQUNDRVNTX01FTlVfV0VCX0RPT1IiLCJXT1JLT1JERVJfT1BfQlVTSU5FU1NfSEFORExFIiwiQlVMTEVUSU5fT1BfQ0FOQ0VMVE9QIiwiUEFUUk9MX01FTlVfQ0hFQ0tQT0lOVF9NQU5BR0UiLCJRVUVTVElPTk5BSVJFX09QX1ZPVEVfQ1JFQVRFIiwiQlVMTEVUSU5fT1BfU1VCTUlUIiwiU0VUVExFRF9PUF9VU0VSX1NFVFRMRURfQUREIiwiQUNDRVNTX1ZJU0lUT1JfQVBQX0NfSU5WSVRFIiwiRU5URVJQUklTRV9PUF9TQ09QRV9VUERBVEUiLCJFTlRFUl9XRUJfU0VSVklDRV9BUFBMWSIsIkVNUExPWUVFX0FQUFJPVkFMX1RBRyIsIlFVRVNUSU9OTkFJUkVfTUVOVV9NQU5BR0UiLCJDUkVERU5USUFMU19NRU5VX01FU1NBR0VfQ19FTlRFUlBSSVNFIiwiRU5URVJfV0VCX09SREVSX1NFUlZJQ0VfTUFOQUdFUiIsIkJVTExFVElOX01FTlVfTElTVF9DIiwiRU5URVJfV0VCX0lOVEVMTElHRU5UX0NIRUNLX01BTkFHRVIiLCJFTVBMT1lFRV9PUFBfQ0FOQ0VMX1RPUCIsIldPUktPUkRFUl9PUF9SRUNFSVZFX05PVElDRSIsIkdST1VQXzAwMDAwMDAwMDAwMDAyMDAiLCJFTlRFUl9XRUJfU1BBQ0VfTUFOQUdFUiIsIkNSRURFTlRJQUxTX01FTlVfQVBQUk9WQUxfUFJPUEVSVFkiLCJBQ1RJVklUWV9PUF9SRVZPS0UiLCJHUk9VUF8wMDAwMDAwMDAwMDAyNTAwIiwiRU5URVJfV0VCX0FQUExZX0NPTkZJR19NQU5BR0VSIiwiQ1JFREVOVElBTFNfTUVOVV9NRVNTQUdFX0MiLCJBQ0NFU1NfTUVOVV9XRUJfVklTSVRPUl9JTlZJVEUiLCJRVUVTVElPTk5BSVJFX01FTlVfQyIsIlBBVFJPTF9PUF9DSEVDS1BPSU5UX0NSRUFURSIsIkVOVEVSX1dFQl9BUFBMWV9TWVNfTUFOQUdFUiIsIkVOVEVSX1dFQl9SRUNSVUlUX01BTkFHRVIiLCJFTlRFUl9XRUJfUFJPSkVDVF9NQU5BR0VSIiwiRU5URVJQUklTRV9PUF9ERVBBUlRNRU5UX0FERCIsIkVOVEVSUFJJU0VfT1BfU1RBRkZfQUREIiwiR1JPVVBfMDAwMDAwMDAwMDAwMTQwMCIsIkNSRURFTlRJQUxTX01FTlVfTVlfQyIsIkVOVEVSX1dFQl9QUk9EVUNUX01BTkFHRVIiXSwianRpIjoiODhmZTczMzktNzdmZS00MzQwLTlhN2EtYmU2MTM2NWQyZDAwIiwiY2xpZW50X2lkIjoiMDAwYWY4ZjBhYmMwMDAwMCIsInNjb3BlIjpbIk9QRU5JRCJdfQ.Ww15OqBhlRVcM7bAOlm47923Jz6QLRgA8VrvAfASfMLepZboVKqrv3ayPHlPDIKjNzLmRpGPYea5GxVL-ozRugvI0EhrEZR1kZOX0xaMugTU8Pvj1eNV3OU-IzlRgiCdRf6UC3AIgw0SBs3_s35geI3vrwIQjOS_HcYWQfgC5iw-6tYiXewD9o2pkl98T-zCFxQyARXetmrNtzveoeFUWB7_8JqEpm5wS1Gk2TIFUWFFIDkk7Di7CUCIeavyzVp2QeVmmEztlr5xe9e1j0QFQCc3njJD44MkOgVqOJvUJpl-DaOAfgsb5uxOtgVpO6MSgNUUukTpr3wEQ15Hmx0ERikGFl5tDam93xwwehtSkvFXIQUi2NMG2zpOjhociN2OYQlU-DQi_4SbLLA_XJpTmSGKqUGi0JJXfhhantaMO8qgz2wtac6YpuL8QOYSGVqjIo62g0CI9LXCWmSQ6hBVU355t4IcFbt_EP8SXH2p_Jakt8q1P1c_VmEelT025MjhRPq3BoT7nb9Lqj45Swvtuthx_hu4QZd4NlEXgDzzuMKfp-jjJInou6RKUCt0ICdnJFke1_zZ9GTuKgBG_ep0ShPSLzCeR7xd3yGGiBlXxtIGMexWFiBMSswKE2dG055SZUwctXYmwy4sBXMGlR3JXrWr_JxQq0sOMuJFNstPvgY`
    // } else {
    //   // const tokenObj = await invokeNative.getToken()
    //   // tokenStr = tokenObj.value;
    // }
});

function handleParams(url, rawData, rawMethod, responseType) {
    const method = rawMethod.toUpperCase();
    let data = {};
    if (method === 'GET') {
        data = { params: rawData };
    }
    switch (method) {
        case 'GET':
            data = { params: rawData };
            break;
        case 'POST':
        case 'PUT':
        case 'PATCH':
        case 'DELETE':
            data = { data: rawData };
            break;
        default:
            data = { params: rawData };
            break;
    }

    return Promise.resolve({
        url,
        method,
        data,
        responseType
    });
}

async function handleFail(option) {
    console.log(option);
    const { error, reject } = option;
    const { response } = error;
    if (response) {
        switch (response.status) {
            case 400:
                message.error('请求失败');
                break;
            case 401:
                break;
            case 403:
                break;
            case 404:
                message.error('请求失败');
                break;
            case 500:
                message.error('请求失败');
                break;
            default:
                message.error('请求失败');
                break;
        }
    } else {
        var originalRequest = error.config;
        if (error.code == 'ECONNABORTED' && error.message.indexOf('timeout') != -1 && !originalRequest._retry) {
            originalRequest._retry = true;
            message.error('请求超时');
        }
    }
    reject(error);
}

let defaultHeader = {
    timezoneoffset: Math.abs(new Date().getTimezoneOffset() / 60),
    locale: 'zh_CN',
    get: {
        'Content-Type': 'application/x-www-form-urlencoded'
    }
};

let refresh = false;
async function refreshToken() {
    refresh = true;
    const para = QS.stringify({
        grant_type: 'refresh_token',
        client_id: 'web_b',
        client_secret: 'times',
        username: window.localStorage.getItem('SD_LOGIN_NAME'),
        password: '',
        scope: 'all',
        refresh_token: window.localStorage.getItem('SD_ACCESS_REFRESHTOKEN')
    });
    api
        .toLogin(para)
        .then(res => {
            if (res.code === 200) {
                window.localStorage.setItem('SD_ACCESS_TOKEN', res.data.token);
                window.localStorage.setItem('SD_ACCESS_REFRESHTOKEN', res.data.refreshToken);
                location.reload();
            }
        })
        .finally(() => {});
}

export const fetchApi = (api, rawData = {}, method = 'GET', headers = {}, responseType = 'json', url = BASEURL) => {
    return handleParams(api, rawData, method, headers, responseType).then(options => {
        return new Promise((resolve, reject) => {
            if (responseType == 'blob') {
                let tokenStr = 'Bearer ' + localStorage.getItem('SD_ACCESS_TOKEN');
                axios({
                    url: options.url,
                    method: options.method,
                    headers: {
                        Authorization: tokenStr,
                        'Content-Type': 'application/json'
                    },
                    data: {...options.data },
                    responseType: 'blob' // 设置服务器响应的数据类型（必选）
                }).then(resp => {
                    const res = resp.data;
                    console.log(resp);
                    // 下载正常处理
                    let fileName = resp.headers['content-disposition'];
                    console.log(fileName);
                    // 获取文件名
                    if (fileName && fileName.length >= 2) {
                        fileName = fileName.split('=')[1];
                    }
                    fileName = decodeURI(escape(fileName));
                    console.log(fileName);
                    // 兼容ie11
                    if (window.navigator.msSaveOrOpenBlob) {
                        try {
                            window.navigator.msSaveOrOpenBlob(new Blob([res]), fileName);
                        } catch (e) {
                            console.log(e);
                        }
                        return;
                    }
                    // a标签实现下载
                    let url = window.URL.createObjectURL(new Blob([res]));
                    let link = document.createElement('a');
                    link.style.display = 'none';
                    link.href = url;
                    link.download = fileName;
                    document.body.appendChild(link);
                    link.click();
                });
            } else {
                HTTP({
                    baseURL: url,
                    withCredentials: true,
                    url: options.url,
                    method: options.method,
                    headers: {...defaultHeader, ...headers },
                    ...options.data
                }).then(
                    resp => {
                        NProgress.done();
                        const res = resp.data;
                        if (res.code === 0) {
                            resolve(res);
                        } else {
                            if (res.code === 401) {
                                if (refresh) {
                                    message.error(res.message);
                                    resolve(res);
                                } else {
                                    message.error(res.message);
                                    resolve(res);
                                    refreshToken();
                                }
                            } else if (res.code !== 200) {
                                message.error(res.message);
                                resolve(res);
                            } else {
                                resolve(res);
                            }
                        }
                    },
                    error => {
                        NProgress.done();
                        handleFail({
                            error,
                            reject,
                            options
                        });

                        throw error;
                    }
                );
            }
        });
    });
};

export default {
    downLoad(url, data) {
        return axios({
            method: 'get',
            url,
            params: data,
            headers: {
                Authorization: 'Bearer ' + localStorage.getItem('SD_ACCESS_TOKEN')
            },
            responseType: 'blob'
        });
    }
};