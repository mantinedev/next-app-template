export function stockValid(stock: number) {
  if (stock === 0 || stock < 0 || stock > 9999) {
    return 'Stok Miktarı Gerçekçi Bir Rakam Olmalı';
  }
}
export function nameisValid(name: string) {
  const punctuation = ['!','@','#','$','%','^','&','*','(',')','-','_','=','+','{','}','[',']','|','\\',';',':',"'",'"','<','>',',','.','/','?',];
  let hasPunctuation = false;
  for (let c of name) {
    if (punctuation.includes(c)) {
      hasPunctuation = true;
    }
  }
  if (hasPunctuation) {
    return 'İsim Değerinde Özel Karakterler Bulunamaz';
  }
}

export function imgValid(img: File) {
  if (img.size > 4096) {
    return 'Medya Dosyası Boyutu En Fazla 4MB Olabilir';
  }
}
