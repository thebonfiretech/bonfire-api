import mongoose from "mongoose";

const investmentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: ["CDB", "CDI", "poupanca"],
        required: true,
    },
    description: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    lastUpdate: {
        type: Date,
        default: Date.now,
    },
    ownerID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "user",
    },
    spaceID: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "space",
    },
    minInvestment: {
        type: Number,
        required: true,
        description: "Valor mínimo para investir."
    },
    maxInvestment: {
        type: Number,
        description: "Valor máximo permitido para investimento."
    },
    interestRate: {
        type: Number,
        required: true,
        description: "Taxa de juros ou retorno do investimento, em porcentagem."
    },
    duration: {
        type: Number,
        required: true,
        description: "Duração do investimento, em meses."
    },
    isRecurring: {
        type: Boolean,
        default: false,
        description: "Indica se o investimento aceita contribuições recorrentes."
    },
    riskLevel: {
        type: String,
        enum: ["baixo", "moderado", "alto"],
        default: "baixo",
        description: "Nível de risco do investimento."
    },
    yieldFrequency: {
        type: String,
        enum: ["diario", "semanal", "mensal"],
        required: true,
        description: "Frequência de rendimento do investimento."
    },
    penaltyRate: {
        type: Number,
        required: true,
        description: "Taxa de multa aplicada caso o valor seja retirado antes do prazo, em porcentagem."
    },
    attachments: {
        type: [String],
        default: [],
    },
});

const investmentModel = mongoose.model("investment", investmentSchema);

export default investmentModel;
