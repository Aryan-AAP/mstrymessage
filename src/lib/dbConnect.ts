import mongoose from "mongoose";

type ConnectionObject={
    isConnected?:number
}


const connection: ConnectionObject={}

async function dbConnect():Promise<void>{
    if(connection
    .isConnected){
        console.log("already connected to databse");
        
    }
    try {
        const db= await mongoose.connect(process.env.MONGODB_URI||'',{})
      connection.isConnected= db.connections[0].readyState
      console.log("DB connected Successsfully");
      
    } catch (error) {
        console.log("Database Connection failed",error);
        
        process.exit(1)
    }
}


export default dbConnect;