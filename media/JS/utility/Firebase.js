import AssignedVar from "./AssignedVar.js";
import User from "../gameplay/User.js";

export default class Firebase {
    static database;
    static get db() {
        return Firebase.database;
    }

    static databaseCollectionUser;
    static get dbUsers() {
        return Firebase.databaseCollectionUser;
    }

    static initialize() {
        firebase.initializeApp({
            apiKey: 'AIzaSyA8X5BGIHdic4rowTSnVhx_OrdHSkonngQ',
            authDomain: 'chess-club-online.firebaseapp.com',
            projectId: 'chess-club-online',
        });
        Firebase.database = firebase.firestore();
        Firebase.databaseCollectionUser = Firebase.db.collection(`users`);
    }
    static setUser(userInfo = {}, successCompletedCallback = () => { }, failCompletedCallback = () => { }) {
        let customUser = new User(
            userInfo.name,
            userInfo.email,
            userInfo.password
        );
        let newUser = Firebase.convertCustomObjToGenericObj(customUser)
        let p = Firebase.dbUsers.doc().set(newUser);
        p.then(() => {
            successCompletedCallback();
        })
            .catch((error) => {
                failCompletedCallback(error);
            });
    }
    static authenticateUser(givenUserName = `phong`, givenPassword = `12345`, completedCallback = () => { }) {
        let isGivenPasswordRight = false;
        let p = Firebase.dbUsers.where(`name`, `==`, givenUserName).get();
        p.then((querySnapshot) => {
            if (!querySnapshot.empty) {
                let documents = querySnapshot.docs;
                let userPassword = documents[0].data().password;
                if (userPassword === givenPassword) {
                    isGivenPasswordRight = true;
                }
                completedCallback(isGivenPasswordRight, documents[0].data());
            } else {
                completedCallback(isGivenPasswordRight, AssignedVar.NO_USER);
            }
        });
    }
    static findNameAndEmailDuplicate(givenName = "phong", givenEmail = "fun@mail.com", givenPassword = `12345`, completedCallback = () => { }) {
        let isNameDuplicate = false;
        let isEmailDuplicate = false;
        let userInfo = {
            name: givenName,
            email: givenEmail,
            password: givenPassword,
        }
        let pName = Firebase.dbUsers.where(`name`, `==`, givenName).get();
        pName.then((querySnapshot) => {
            if (!querySnapshot.empty) {
                isNameDuplicate = true;
            }
            let pEmail = Firebase.dbUsers.where(`email`, `==`, givenEmail).get();
            pEmail.then((querySnapshot) => {
                if (!querySnapshot.empty) {
                    isEmailDuplicate = true;
                }
                completedCallback(isNameDuplicate, isEmailDuplicate, userInfo);
            });
        });
    }
    static convertCustomObjToGenericObj(customObj) {
        let genericObj = {};
        for (let property in customObj) {
            genericObj[property] = customObj[property];
        }
        return genericObj;
    }
}