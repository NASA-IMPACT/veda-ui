export const readCookie = (name) => {
    const nameEQ = name + '=';
    const attribute = document.cookie.split(';');
    for (let i = 0; i < attribute.length; i++) {
      let c = attribute[i];
      while (c.charAt(0) == ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  };