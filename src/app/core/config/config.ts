export const appConfig = {
    withoutLoginUrls: ['/'],
    perPageDefault: 1,
    perPageArray: [12, 24, 36, 48, 60],
    perPageTblArray: [10, 20, 30, 40, 50, 100],
    perPageTblDefault: 1,
    date_format: 'DD-MM-YYYY',
    google_doc_path: window.location.protocol + "//docs.google.com/viewer?url=",
    yearRange: 100,
    statusCode: {
        'ok':200,
        'created':201,
        'accepted':202,
        'noContent':204,
        'found':302,
        'temporaryRedirect':307,
        'badRequest': 400,
        'unauthorized': 401,
        'paymentRequired': 402,
        'forbidden': 403,
        'notFound': 404,
        'notAcceptable': 406,
        'conflict': 409,
        'preconditionFailed': 412,
        'payloadTooLarge': 413,
        'unsupportedMediaType': 415,
        'invalidToken': 498,
        'internalServerError': 500,
        'notImplemented': 501,
        'badGateway': 502,
        'serviceUnavailable': 503,
        'gatewayTimeout': 504,
        'httpVersionNotSupported': 505,
        'networkAuthenticationRequired': 511
    },
    pattern: {
        'USERNAME': /[a-zA-Z0-9_]{3,15}$/ig,
        'NAME': /^[a-zA-Z . \-\']*$/,
        "CITY": /^[a-zA-Z . \-\']*$/,
       // "EMAIL": /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "EMAIL":/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
        "POSTAL_CODE": /(^\d{5}(-\d{4})?$)|(^[ABCEGHJKLMNPRSTVXY]{1}\d{1}[A-Z]{1} *\d{1}[A-Z]{1}\d{1}$)/, // /(^\d{5}$)|(^\d{5}-\d{4}$)/,
        "SUB_DOMAIN": /^[/a-z/A-Z][a-zA-Z0-9-]*[^/-/./0-9]$/,
        "PHONE_NO": /\(?\d{3}\)?-? *\d{3}-? *-?\d{4}/,
        "TASK_CODE": /^[0-9999]{1,4}$/,
        "SSN": /^((\d{3}-?\d{2}-?\d{4})|(X{3}-?X{2}-?X{4}))$/,
        "TRANSACTION_PIN": /d{4}$/,
        "PASSWORD": /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]+$/
    },
    email: {
        abuse_email: "no-reply@admin.busade-emr-demo.com",
        copyright: (new Date().getFullYear()) + " Copyright Busade EMR Demo",
        logo_url: "/public/images/logo.png"
    },
    position: {
        "super_admin": { id: '1', name: "Super Admin"},
        "admin": { id: '2', name: "Admin"},
        "doctor": { id: '3', name: "Doctor"},
        "nurse": { id: '4', name: "Nurse"},
        "receptionist": { id: '5', name: "Receptionist" },
        "biller": { id: '6', name: "Biller"},
        "lab_tech": { id: '7', name: "Lab Technician"},
        "pharmacist": { id: '8', name: "Pharmacist"},
        "patient": { id: '9', name: "Patient"}
    },
    files: {
        MAX_IMG_SIZE: 20 * 2000 * 2000
    },
    storage: {
        'AUDIT_LOGIN': '_busade_audit_login',
        'currentUser': '_busade_cu_',
        'refreshToken': '_busade_rt_'
    },
    LOADER_TIMEOUT:10000
    
}