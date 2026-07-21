import FormSettings from "../models/FormSetting.js" ;

const initFormSettings= async()=>{
  const settings= await FormSettings.findOne();

  if(!settings){
    await FormSettings.create({
      isFormActive:false
    });
    console.log("Default FormSetting created")
  }
};
export default initFormSettings;