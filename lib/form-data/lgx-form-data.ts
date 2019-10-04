import {
  TFormDataCallback,
  IFormDataConfig
} from "../interfaces/lgx-form-data";
import FormData from "form-data";

const isUndefined: TFormDataCallback = value => value === undefined;
const isNull: TFormDataCallback = value => value === null;
const isObject: TFormDataCallback = value => value === Object(value);
const isArray: TFormDataCallback = value => Array.isArray(value);
const isDate: TFormDataCallback = value => value instanceof Date;
const isBlob: TFormDataCallback = value =>
  value &&
  typeof value.size === "number" &&
  typeof value.type === "string" &&
  typeof value.slice === "function";
const isFile: TFormDataCallback = value =>
  isBlob(value) &&
  typeof value.name === "string" &&
  (typeof value.lastModifiedDate === "object" ||
    typeof value.lastModified === "number");

const lgxObjectToFormData = (
  obj: any,
  cfg?: IFormDataConfig,
  fd?: FormData,
  pre?: string
) => {
  cfg = cfg || {};
  cfg.indices = isUndefined(cfg.indices) ? false : cfg.indices;
  cfg.nullsAsUndefineds = isUndefined(cfg.nullsAsUndefineds)
    ? false
    : cfg.nullsAsUndefineds;
  fd = fd || new FormData();

  if (isUndefined(obj)) {
    return fd;
  } else if (isNull(obj)) {
    if (!cfg.nullsAsUndefineds) fd.append(pre!, "");
  } else if (isArray(obj)) {
    if (!obj.length) {
      const attribute: string = pre + "[]";
      fd.append(attribute, "");
    } else {
      obj.forEach((value: string, index: number) => {
        if (isFile(value) || isBlob(value)) pre = pre || "file";
        const attribute: string = pre + "[" + (cfg!.indices ? index : "") + "]";
        lgxObjectToFormData(value, cfg, fd, attribute);
      });
    }
  } else if (isDate(obj)) {
    fd.append(pre!, obj.toISOString());
  } else if (isObject(obj) && !isFile(obj) && !isBlob(obj)) {
    Object.keys(obj).forEach(prop => {
      const value = obj[prop];
      if (isArray(value)) {
        while (prop.length > 2 && prop.lastIndexOf("[]") === prop.length - 2) {
          prop = prop.substring(0, prop.length - 2);
        }
      }
      const attribute = pre ? pre + "[" + prop + "]" : prop;
      lgxObjectToFormData(value, cfg, fd, attribute);
    });
  } else if (isFile(obj)) {
    fd.append(pre || "file", obj, obj.name || pre || "file");
  } else {
    fd.append(pre!, obj);
  }
  return fd;
};

export default lgxObjectToFormData;
