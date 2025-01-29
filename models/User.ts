import mongoose, { Schema, model, models } from "mongoose";

// Definição do esquema do usuário
const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  });
  
  // Evitar recriar o modelo em ambiente de desenvolvimento
  const User = models.User || model("User", userSchema);
  
  export { User }; // Exporta o modelo User
