const mongoose=require('mongoose');

const RegData=new mongoose.Schema({
    gender:{
        type:String,
        require:true,
    },
    FirstName:{
        type:String,
        require:true,
    },
    SurName:{
        type:String,
        require:true,
    },
    email:{
        type:String,
        require:true,
    },
    password:{
        type:String,
        require:true,
    },



    // .....dietplan scheema

    type_of_person:{
        
        type:String,
        ear:["male","female"],
        require:true,
    },
    type_of_plan:{
        
        type:String,
        ear:["Lose2-3stone","Lose1-2stone","Lose11-13stone","Lose6-9stone","Lose2-4stone"],
        require:true,
    },
    amount:{
        type:String,
        require:true,
    },


    // ....order plan schema

    type_of_food:{
        
        type:String,
        ear:["breakfast","lunch","dinner","snacks"],
        require:true,
    },
    selected_item:{
        type:String,
        require:true,
    },
    no_of_selected_items:{
        type:String,
        require:true,
    }





})
module.exports=mongoose.model("RegData",RegData);