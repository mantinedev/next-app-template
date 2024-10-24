function emailIsValid(email: string) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function passwordValid(password: string) {
  //UZUNLUK
  if (password.length < 4) {
    return 'Parola en az 4 karakter olmalı.';
  }
  //BÜYÜK KÜÇÜK HARF
  let hasUpperCase = false;
  for (let char of password) {
    if (char >= 'A' && char <= 'Z') {
      hasUpperCase = true;
      break;
    }
  }
  if (!hasUpperCase) {
    return 'Parola en az bir büyük harf içermeli.';
  }
  //NOKTALAMA İŞARETLERİ
  const punctuation = ['!','@','#','$','%','^','&','*','(',')','-','_','=','+','{','}','[',']','|','\\',';',':',"'",'"','<','>',',','.','/','?',];
  let hasPunctuation = false;
  for (let char of password) {
    if (punctuation.includes(char)) {
      hasPunctuation = true;
      break;
    }
  }
  if (!hasPunctuation) {
    return 'Parola en az bir noktalama işareti içermeli.';
  }
  return '';
}

function passwordMatchValid(password: string, repassword: string) {
  return password === repassword;
}
module.exports = {
  emailIsValid,
  passwordMatchValid,
  passwordValid,
};
