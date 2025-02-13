import app from './app';

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server corriendo en el puerto ${PORT}`);
});

// model Appointment {
//     id          String   @id @default(uuid())
//     clientName  String   // Nombre del cliente
//     phone       String   // Número de teléfono del cliente
//     barberId    String   // Barbero elegido por el cliente
//     barber      User     @relation(fields: [barberId], references: [id])
//     date        DateTime
//     status      Status   @default(PENDING)
//     haircutId   String?  // Corte de cabello elegido
//     haircut     Haircut? @relation(fields: [haircutId], references: [id])
//     paymentId   String?  
//     payment     Payment? @relation(fields: [paymentId], references: [id])
//     review      Review?
//     createdAt   DateTime @default(now())
//     updatedAt   DateTime @updatedAt
//   }
  
//   model Payment {
//     id          String   @id @default(uuid())
//     appointmentId String @unique
//     appointment Appointment @relation(fields: [appointmentId], references: [id])
//     amount      Float
//     status      PaymentStatus @default(PENDING) // PENDING, APPROVED, REJECTED
//     verifiedBy  String?  // ID del administrador que verificó el pago
//     admin       User?    @relation(fields: [verifiedBy], references: [id])
//     createdAt   DateTime @default(now())
//   }
  
//   model Review {
//     id          String   @id @default(uuid())
//     phone       String   // Cliente identificado por número
//     appointmentId String @unique
//     appointment Appointment @relation(fields: [appointmentId], references: [id])
//     barberId    String
//     barber      User     @relation(fields: [barberId], references: [id])
//     rating      Int      // Calificación (0-5 estrellas)
//     comment     String?
//     createdAt   DateTime @default(now())
//   }
  
//   model WithdrawalRequest {
//     id          String   @id @default(uuid())
//     barberId    String
//     barber      User     @relation(fields: [barberId], references: [id])
//     amount      Float
//     status      WithdrawalStatus @default(PENDING) // PENDING, APPROVED, REJECTED
//     processedBy String?  // ID del administrador que procesa la solicitud
//     admin       User?    @relation(fields: [processedBy], references: [id])
//     createdAt   DateTime @default(now())
//   }
  
//   model Haircut {
//     id          String   @id @default(uuid())
//     name        String
//     price       Float
//     description String?
//     imageUrl    String?
//     barberId    String   // Relación con el barbero
//     barber      User     @relation(fields: [barberId], references: [id])
//     appointments Appointment[]
//   }
  
//   model User {
//     id        String   @id @default(uuid())
//     name      String
//     email     String?  @unique
//     password  String?
//     role      Role     @default(BARBER)
//     phone     String?  @unique
//     bankName  String?  // Nombre del banco
//     bankCode  String?  // Código del banco
//     bankAccount String? // Número de cuenta bancaria
//     nationalId String? // Cédula del barbero
//     haircuts  Haircut[]  // Catálogo de cortes del barbero
//     appointments Appointment[]
//     reviews   Review[]
//     payments  Payment[]
//     withdrawals WithdrawalRequest[]
//   }
  
//   enum Role {
//     ADMIN
//     BARBER
//   }
  
//   enum Status {
//     PENDING
//     CONFIRMED
//     CANCELED
//   }
  
//   enum PaymentStatus {
//     PENDING
//     APPROVED
//     REJECTED
//   }
  
//   enum WithdrawalStatus {
//     PENDING
//     APPROVED
//     REJECTED
//   }
  