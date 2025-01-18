import { TransactionModelType } from "@utils/types/models/transaction";
import transactionModel from "@database/model/transaction";
import userModel from "@database/model/user";

export const createTransaction = async (transaction: Partial<TransactionModelType>) => {
    let isSendTransaction = (transaction.value || 0) < 0; 
    let description = "";

    switch(transaction.type){
        case "buy":
            description = `${isSendTransaction ? "Comprou" : "Vendeu"} um *${transaction?.items?.name || "produto"}* por ${String(transaction.value).replace("-","")} gentilezas`
        break;
        case "pix":
            const transactionUser = await userModel.findById(isSendTransaction ? transaction.fromID : transaction.toID);
            description = `${isSendTransaction ? "Enviou" : "Recebeu"} um total de *${String(transaction.value).replace("-","")}* gentilezas ${isSendTransaction ? "para" : "de"} *${transactionUser?.name || "Usuário desconhecido"}*`
        break;
        default:
            description = `${isSendTransaction ? "Enviou" : "Recebeu"} um total de *${String(transaction.value).replace("-","")}* gentilezas ${isSendTransaction ? "para" : "de"} *Destino desconhecido*`
        break
    }

    const newTransaction = new transactionModel({
        lastUpdate: Date.now(),
        ...transaction,
        description
    });

    return newTransaction.save();
};