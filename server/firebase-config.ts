import admin from 'firebase-admin';

// إعداد Firebase للبوتيك (متجر الملابس)
const BOUTIQUE_SERVICE_ACCOUNT = {
  "type": "service_account",
  "project_id": "larozastoredata",
  "private_key_id": "4bf1c1a7a73bee3970ac9a65a0acd7f9c8137220",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDHjgMMOFuuNu7t\n1QiXmgzswX9FVrg/HZ+I2h5C5EzhP4vMr3cZGQ7evTb3F1ebeXA7KkgTcI/H+Qsi\nuXOaUtcw/drMnYiLcRkP/pjZ1YiaUxyofTqXpKGyClJpQ75kBpe2qGPZuuBVCh8W\njNP+3kgM5ZU+A5Aj73vyBgb7HgJlyInzGIRW5nnWPITeUKX0bWL8Uckq2xoolSyd\nHaNeU6ansevuX/KRNiEK6FT3uhs3sjmRTw5GFi/JU9rLwUdMvOx353yVUjCPVnRX\nh+S+2ua/N1Pt3sMPNzDgCDOFHfld+KPF+uzaiQXt/1t7vN/9uM/9nQYkYbXS8BUS\nwdIUfS07AgMBAAECggEAX84mWG+WVIW7ICPvBBnJqsEbQUbpHiQyu5k8fhDteBby\nH0r+euY05WsiQG7MeLBM2ZrrD6oy3WcLmZg/kA/FkJfPu/zF2WxrA+rPp4WFF9Jf\nJ+U3hCZeGwQpnLARcCRaIi+mAJpfqXQ6iLED9pDxNn/irus3AImxj/ik0VsO+535\ntd61aCOFAW0m2SitMKUmqVuc0EWIx1WjRrLABitPL4DW38PsKw4H4D80dlUirsyj\nxwZOL7DL8itoV9eBbdWwbC2dDVYwC/ruyhckYbRERh4PhrIVAbodHvI6HHuRARn2\nt2crgcU4halWqmEHTMacDnrQG9kQMhfe0zwyTnwTQQKBgQD6PC4T8ry2BNjlWPww\nxNmFftNhBWB2NH2suPh7EUWZBOTZ2euBSn/2m647bWbnO7AMRiWW2lcjLKJNg2sn\nvyZmUzsLq7h+maLsx4mY2qxMN/FSQMbn3wao9Dj8JgjF54LhxEiyumd/Fxc+DDRT\n1ry5hZD3ArSLCfFPLVacT0SZRwKBgQDMJu7F/oy5sE5FcxvHDwNvf/LeQO2U0BwZ\niLWaZZEZ+u7dnLsp4WnKgWUFYeQV8h7LsYgyDQxYzwN65pJzmzLzOCbM/cCCnxtk\nHMznxo+KGzRi4d5JSjubDI4eD9Jfr6ZyY96YTbAvmFb+W3zyn0ndJemSn/EnT0ag\nDa9hKe3GbQKBgQCy9NjrMTyeW8cV9ladNhpuKy5Wg3bh8lYycTJbKRYCAgr8danE\nFBiBsAKhw3LFSd10WbJGOS36HNCR6Lt4eG6o3Tsr9IoEGDH5bhZMd46jD5sI/QSD\nDPABYm9ifHzns9LZTPvEviSIMmZP3ICLuNXNQ+VRkeC2Usz9l+oJ7XKcvwKBgQCp\nmYpxyCfGt7Y+sgMYmttizOvKQixdnYpKmC0uaERkTfgU+XjvsQk/J8Hx98IRjUSS\nOhmIYxinysr8VgLCseNg9Xwefoxot598ywRbZLSoqjMaFsShJF9iTsreJIzD21uu\n2lL5OkktMSTMSNsDgNtPMojZu7AO1Sg6HURetwOG/QKBgEuMH2sra2EuGC7yObYO\nXdazgnissNIn6tmJjYdzodlZtqmKFO1KeNkXzxqFSDD1Lanb3l0PVLDbp595l/mR\nYlbr7nkTMv7exOrEOFtXIAdhTc/5IwLZe3qgOkqZgxCKa1qiwyie+2Rpw9C4DdqH\nCtni7dqapFXWJYtjLxG+EM5o\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-fbsvc@larozastoredata.iam.gserviceaccount.com",
  "client_id": "112267544942949994225",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40larozastoredata.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"
};

// إعداد Firebase للمتجر الإلكتروني
const ONLINE_SERVICE_ACCOUNT = {
  "type": "service_account",
  "project_id": "laroza-c6ef4",
  "private_key_id": "760b483755fbced75690c56e100c944297e815d1",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDFEwNIHoyhyVdL\nF/Szhz3tl6W5v9R8PSKVD1PR8t6iFTAIPOgZt2h4z6xUw5m7meavbkVaISJcaqfP\n7vrdUjwKmUcY8sy6hIAjxsSDJwzVgMixW/A8ekZyZojbrtEAOtj8zWwsiE0SmDE1\nR+vTeOn7UWyjdrJR9RseFvnJKlTumJAqGR6ImngO9pltkzKnAkZAL7MLg44e8rlS\nILpMU03j9CF/Al+KDnm58h7+sQSIZHEe/VCJ9CNgS1S0rCixyxfj7bQSfUC/GHkI\n2wLbOuQD9mOZ1tUrmYHH2yqxUK9UuMALCiV+sO0RRgu58Jy/hT0ENI+OerBwCjNi\ni5Y4n2qBAgMBAAECggEAA8ugxw1LkRFtxx+gJ1Wl9C2fqUr6qSU2RXT6R3NWz/v6\nJQEjSTIr5r5n0mltTFx47GJXyetpxtTeWYCqlS5Fw2sooDWLitYNb7hJcECFcevd\nMZ6UgF2sffyKizc72uDHQrXOwlwiUTGG1RYHAoIezifHIK4jCLVglHzwdOwwnuMJ\nooaicXumXBzE4mPn2QfdsRz4eMGRC1YsOsc0olAFRvaFCQ8y11nJ7hm6Q5mD4k0F\nSXgYgvGHJq/DPRFCxkccaLjQwYTOaajuZCtMS6kLXTTW1ZFSWHHJBsZ34Wt2R1P3\n1TuJXB2+gY4Bq8yoI+8YH43BhsNPS7KHF+QQin+cgQKBgQDuACFDNDRfVxvMXYDH\n0CxGl6zmxcHkzflCv1UH1e7AmhibpnexIwODh5BqpptergVn7iZsMde7OrD4hrIg\nYE6eu0+3SdGnm0IZ9EPIuvTenVWSEZkmml+YthV//x2tzU2K/JrLrpKhII4lLXXS\nPL/VoJhm/KmzFDXorthOuk1aUQKBgQDT+oUY7lvIyRGZNV3r82QZwmfoA34GkXZ9\n6z2rU3mx+DGWxArr0J8AXE0CiOAJnO8xhXmyiuCFLNIeWii26OKXjH9DiT2ljZM5\nxiBYL8EqTFIucf/5DULxK5Dd3V2PJNztFIMs2ya5EU2bnDMjXSq80P3Nh+CYauhy\npC+XbYXRMQKBgHZHhkBZ33VKWzxTc77ZzEdA9eKygUvuuWPcpquAPGlnq7cfIfjc\nh9CEPNdj+W8yWOlvx5SZqLcZ0f2RI1FHy4rDWDik7Ra46D7x0AYgM7W2x2IScORo\nb/367/BunxdTIqhiJaP4HFMLVNlRIG7dVhEbAOKdytB+yNPcoQ9vMyYhAoGBAL3A\nTm5Px/eHDWrQ278/w0ZPwMVugtyMT75N2olHkvMdkf48hO4sdHhVJ1ZygeH5CiCR\nM6wAJxTvVzN2T2XUOCmiybUB4B4XCkg4M3HdZZNgeFw9Df65wUezUN1Zr8tYGy9a\nIkX/8rzNYWQ/QYORfZVBmz/lNsYZRPSCRlvN3XCxAoGAGCmYWrw3rhOD4xfiQb7/\nvTkMrfnzeks/+jHIWKEkgIUYx1DhGaPShDm0pwWMiVrqJUkG+f1uKW4bFcShr+es\nSP+CSyVz48qUqHnohcleeY5taHrAbPg7vKg5Gq0jdeexRBwNTunRkvlE45niCqQ4\nhcNMBrkmiNLHvPJnqopQ1AA=\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-fbsvc@laroza-c6ef4.iam.gserviceaccount.com",
  "client_id": "104118817253005505723",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40laroza-c6ef4.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"
};

// تهيئة Firebase للبوتيك (متجر الملابس)
let boutiqueApp: admin.app.App | null = null;
let boutiqueDatabase: admin.database.Database | null = null;

// تهيئة Firebase للمتجر الإلكتروني
let onlineApp: admin.app.App | null = null;
let onlineDatabase: admin.database.Database | null = null;

// تهيئة Firebase فقط إذا لم تكن في وضع التطوير
if (process.env.NODE_ENV !== 'development') {
  try {
    // تهيئة البوتيك
    if (!admin.apps.find(app => app?.name === 'boutique')) {
      boutiqueApp = admin.initializeApp({
        credential: admin.credential.cert(BOUTIQUE_SERVICE_ACCOUNT as admin.ServiceAccount),
        databaseURL: "https://larozastoredata-default-rtdb.firebaseio.com/",
      }, 'boutique');
      
      boutiqueDatabase = boutiqueApp.database();
      console.log('✅ Firebase Boutique initialized successfully');
    }

    // تهيئة المتجر الإلكتروني
    if (!admin.apps.find(app => app?.name === 'online')) {
      onlineApp = admin.initializeApp({
        credential: admin.credential.cert(ONLINE_SERVICE_ACCOUNT as admin.ServiceAccount),
        databaseURL: "https://laroza-c6ef4-default-rtdb.firebaseio.com/",
      }, 'online');
      
      onlineDatabase = onlineApp.database();
      console.log('✅ Firebase Online initialized successfully');
    }
  } catch (error) {
    console.error('❌ Firebase initialization failed:', error);
  }
} else {
  console.log('🔧 Development mode: Firebase connections disabled, using memory storage');
}

export { boutiqueDatabase, onlineDatabase, boutiqueApp, onlineApp };