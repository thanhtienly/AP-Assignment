import { db } from "../database/db.js";
import { ref, push, get, child } from "firebase/database";
import { MedicineImport } from "../models/medicine.js";
import { toNonAccentVietnamese } from "./helper.js";

export function addMedicine(medicineList) {
  medicineList.forEach(async (medicine) => {
    var medicineInfo = new MedicineImport(
      medicine["name"],
      medicine["type"],
      medicine["provideBy"],
      medicine["expire_date"],
      medicine["price"],
      medicine["quantity"]
    );
    await push(ref(db, "medicines"), medicineInfo.toFireStore());
  });
}

export async function getMedicineByName(queryName) {
  const dbRef = ref(db);
  const medicineMap = await get(child(dbRef, "medicines"))
    .then((snapShot) => {
      if (snapShot.exists()) {
        return { ...snapShot.val() };
      }
      return "";
    })
    .catch((error) => {
      console.log(error);
    });

  const medicineIds = Object.keys(medicineMap);
  let validMedicines = [];

  medicineIds.forEach((id) => {
    var medicineInfo = medicineMap[id];

    var nonAccentMedicineName = toNonAccentVietnamese(medicineInfo["name"]);
    var nonAccentQueryName = toNonAccentVietnamese(queryName);

    var regex = new RegExp(nonAccentQueryName, "gi");

    if (nonAccentMedicineName.match(regex)) {
      var medicineImport = new MedicineImport(
        medicineInfo["name"],
        medicineInfo["type"],
        medicineInfo["provideBy"],
        medicineInfo["expire_date"],
        medicineInfo["price"],
        medicineInfo["quantity"]
      );
      medicineImport.formatExpireDate();
      validMedicines.push({
        id: id,
        ...medicineImport.toFireStore(),
      });
    }
  });
  console.log(validMedicines);
  return {
    statusCode: 200,
    result: validMedicines,
  };
}

export async function getMedicineExpireAt(timestamp) {
  const dbRef = ref(db);
  const medicineMap = await get(child(dbRef, "medicines"))
    .then((snapShot) => {
      if (snapShot.exists()) {
        return { ...snapShot.val() };
      }
      return "";
    })
    .catch((error) => {
      console.log(error);
    });

  const medicineIds = Object.keys(medicineMap);
  let expiredMedicines = [];

  medicineIds.forEach((id) => {
    var medicineInfo = medicineMap[id];
    if (medicineInfo["expire_date"] < timestamp) {
      var medicineImport = new MedicineImport(
        medicineInfo["name"],
        medicineInfo["type"],
        medicineInfo["provideBy"],
        medicineInfo["expire_date"],
        medicineInfo["price"],
        medicineInfo["quantity"]
      );
      medicineImport.formatExpireDate();
      expiredMedicines.push({
        id: id,
        ...medicineImport.toFireStore(),
      });
    }
  });

  return {
    statusCode: 200,
    result: expiredMedicines,
  };
}
