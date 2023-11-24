export const ESPHOME_KEY =
  'eyJzdWIiOiJFU1BIb21lIiwibmFtZSI6IkdhcmFnZSIsImlhdCI6MTUxNjIzOTAyMn0';
export const GEOCODING_KEY =
  '61cefcc612msh04fe1c5b7be6beep1c7dd8jsn5cd0b3377281';

export const AUTH_PASSWORDS = ['gadem'];
export const VALID_ZIPS = ['92127'];

export const DEV_KEYS = ['##URLCHANGE##'];
export const DEV_FUNCS = function (devKey: string, param?: any[]) {
  switch (devKey) {
    case '##URLCHANGE##':
      {
        if (param != null && param.length >= 2) {
          param[0] = param[1];
        } else {
          throw new Error('Expected Param in Dev Script');
        }
      }
      break;

    default:
      {
      }
      break;
  }
};
