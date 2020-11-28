import AssignedVar from "./utility/AssignedVar.js";
import User from "./gameplay/User.js";

export default function initUsers(){
    AssignedVar.thisUser = new User();
    AssignedVar.enemyUser = new User();
}