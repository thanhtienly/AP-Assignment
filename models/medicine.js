class MedicineImport {
  constructor(name, type, provideBy, expire_date, price, quantity) {
    this.name = name;
    this.type = type;
    this.provideBy = provideBy;
    this.expire_date = expire_date;
    this.price = price;
    this.quantity = quantity;
  }

  formatExpireDate() {
    var date = new Date(this.expire_date)
      .toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
      .replaceAll(/\s/g, "-");
    this.expire_date = date;
  }
  toFireStore() {
    return {
      name: this.name,
      type: this.type,
      provideBy: this.provideBy,
      expire_date: this.expire_date,
      price: this.price,
      quantity: this.quantity,
    };
  }
}

export { MedicineImport };
