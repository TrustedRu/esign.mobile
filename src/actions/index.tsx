import {
    FOOTER_ACTION, FOOTER_CLOSE, PERSONAL_CERT_ACTION, OTHER_CERT_ACTION, CLEAR_LOG,
    READ_FILES, READ_FILES_SUCCESS, READ_FILES_ERROR,
    ADD_FILES, ADD_FILES_SUCCESS, ADD_FILES_ERROR, CLEAR_FILES,
    ADD_CERT_OR_KEY, ADD_CERT_SUCCESS, ADD_CERT_ERROR, ADD_KEY_SUCCESS, ADD_KEY_ERROR
} from "../constants";
import * as RNFS from "react-native-fs";
import { NativeModules } from "react-native";
import { readCertKeys } from "./CertKeysAction";

export function footerAction(idButton) {
    return {
        type: FOOTER_ACTION,
        payload: idButton
    };
}

export function footerClose() {
    return {
        type: FOOTER_CLOSE
    };
}

export function personalCertAdd(title, img, note, issuerName, serialNumber, provider) {
    return {
        type: PERSONAL_CERT_ACTION,
        payload: [title, img, note, issuerName, serialNumber, provider]
    };
}

export function otherCertAdd(title, img, note, issuerName, serialNumber, provider) {
    return {
        type: OTHER_CERT_ACTION,
        payload: [title, img, note, issuerName, serialNumber, provider]
    };
}

export function clearFiles() {
    return {
        type: CLEAR_FILES
    };
}

export function readFiles() {
    return function action(dispatch) {
        dispatch({ type: READ_FILES });
        RNFS.mkdir(RNFS.DocumentDirectoryPath + "/Files").then(
            response => {
                const request = RNFS.readDir(RNFS.DocumentDirectoryPath + "/Files"); // "/cprocsp/users/stores"
                return request.then(
                    response => {
                        dispatch(clearFiles());
                        dispatch(footerClose());
                        dispatch(readFilesSuccess(response));
                    },
                    err => dispatch({ type: READ_FILES_ERROR })
                );
            },
            err => { null; }
        );
    };
}

export function readFilesSuccess(file) {
    return function action(dispatch) {
        let filearr = [], point, name, extensionAll, extension, date, month, year, hours, minutes, time, seconds, verify = 0;
        let length = file.length;
        let k = 0;
        for (let i = 0; i < length; i++) {
            point = file[i].name.indexOf(".");
            name = file[i].name.substring(0, point);
            extensionAll = file[i].name.substring(point + 1);
            point = extensionAll.lastIndexOf(".");
            extension = extensionAll.substring(point + 1);
            date = file[i].mtime.getDate();
            month = file[i].mtime.getMonth();
            switch (month) {
                case 0: month = "января"; break;
                case 1: month = "февраля"; break;
                case 2: month = "марта"; break;
                case 3: month = "апреля"; break;
                case 4: month = "мая"; break;
                case 5: month = "июня"; break;
                case 6: month = "июля"; break;
                case 7: month = "августа"; break;
                case 8: month = "сентября"; break;
                case 9: month = "октября"; break;
                case 10: month = "ноября"; break;
                case 11: month = "декабря"; break;
                default: break;
            }
            year = file[i].mtime.getFullYear();
            hours = "" + file[i].mtime.getHours();
            if (hours.length === 1) { hours = "0" + hours; }
            minutes = "" + file[i].mtime.getMinutes();
            if (minutes.length === 1) { minutes = "0" + minutes; }
            seconds = "" + file[i].mtime.getSeconds();
            if (seconds.length === 1) { seconds = "0" + seconds; }
            if (name === "") {
                // k++;
                name = extension;
                extension = 0;
                filearr[i - k] = { name, extension, extensionAll, date, month, year, hours, minutes, seconds, verify };
            } else {
                filearr[i - k] = { name, extension, extensionAll, date, month, year, hours, minutes, seconds, verify };
            }
        }
        dispatch({ type: READ_FILES_SUCCESS, payload: filearr });
    };
}

export function clearLog() {
    return {
        type: CLEAR_LOG
    };
}

export function addFiles(uri, type, fileName, fileSize) {
    return function action(dispatch) {
        dispatch({ type: ADD_FILES });
        let point, name;
        point = fileName.indexOf(".");
        name = fileName.substring(0, point);
        const copyFile = RNFS.copyFile(decodeURIComponent(uri.replace("file:///", "/")), RNFS.DocumentDirectoryPath + "/Files/" + fileName);
        return copyFile.then(
            response => {
                dispatch({ type: ADD_FILES_SUCCESS, payload: name });
                dispatch(readFiles());
            },
            err => dispatch({ type: ADD_FILES_ERROR, payload: name })
        );
    };
}

export function addCert(uri, type, fileName, fileSize, password) {
    return function action(dispatch) {
        dispatch({ type: ADD_CERT_OR_KEY });
        let point, name, extension;
        point = fileName.indexOf(".");
        name = fileName.substring(0, point);
        extension = fileName.substring(point + 1);
        switch (extension) {
            case "pfx": {
                let certPath = decodeURIComponent(uri.replace("file:///", "/"));
                NativeModules.PCerts.importPFX(
                    certPath,
                    password,
                    (err, imp) => {
                        if (err) {
                            dispatch({ type: ADD_CERT_ERROR, payload: err });
                        } else {
                            dispatch({ type: ADD_CERT_SUCCESS, payload: name });
                            dispatch(readCertKeys());
                        }
                    });
                break;
            }
            case "cer":
            case "crt": {
                let certPath = decodeURIComponent(uri.replace("file:///", "/"));
                const read = RNFS.read(certPath, 2, 0, "utf8");
                return read.then(
                    response => {
                        NativeModules.WCert.saveCertToStore(
                            certPath,
                            response === "--" ? "BASE64" : "DER",
                            "MY",
                            (err, saveCert) => {
                                if (err) {
                                    dispatch({ type: ADD_CERT_ERROR, payload: err });
                                } else {
                                    dispatch({ type: ADD_CERT_SUCCESS, payload: name });
                                    dispatch(readCertKeys());
                                }
                            });
                    },
                    err => { dispatch({ type: ADD_CERT_ERROR, payload: name }); }
                );
            }
            case "key": {
                let certPath = decodeURIComponent(uri.replace("file:///", "/"));
                NativeModules.WCert.saveKeyToStore(
                    certPath,
                    "BASE64",
                    "",
                    (err, saveKey) => {
                        if (err) {
                            dispatch({ type: ADD_KEY_ERROR, payload: err });
                        } else {
                            dispatch({ type: ADD_KEY_SUCCESS, payload: name });
                            dispatch(readCertKeys());
                        }
                    });
                break;
            }
            default: {
                break;
            }
        }
    };
}