
//import firebase base on your environment virsion
//this is for web version 9
//read review only
import {collection, query, where, getDocs, getFirestore} from 'https://www.gstatic.com/firebasejs/9.6.7/firebase-firestore.js'
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.7/firebase-app.js";
import { Config } from "./config.js"
import { currentlocation } from './currentlocation.js';


//set up api Key
const firebaseConfig = {
  apiKey: Config.apiKey,
  authDomain: Config.authDomain,
  projectId: Config.projectId,
  storageBucket: Config.storageBucket,
  messagingSenderId: Config.messagingSenderId,
  appId: Config.appId,
  measurementId: Config.measurementId,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

var location = currentlocation();
var lat = location[0];
var long = location[1];



var LocationID =[];
let allDocs = [];
  
const q = query(collection(db, "location"), where("latitude", ">=", lat-0.02),where("latitude", "<=", lat+0.02));
const querySnapshot = await getDocs(q);
console.log("hello")
querySnapshot.forEach((doc) => {
  
    let lat1 = doc.data().latitude;
    let long1 = doc.data().longitude;
    if(long1 >= (long-0.02) && long1 <= (long+0.02)){
      LocationID.push(doc.id);
    }
    
});
    

//Pull every review from firestore
for(let i = 0; i < LocationID.length; i++) {
  let ReviewID;

  //here are all info for one review
  let picturelink;
  let comment;
  let rate;
  let name;
  let street;
  let state;
  let postal;
  let picture;
  
  const r = query(collection(db, "review"), where("ID", "==", LocationID[i]));
  const reviewquerySnapshot = await getDocs(r);
   
  //pull review text inf
  reviewquerySnapshot.forEach((doc) => {
      console.log(doc.data())
      comment = doc.data().comment;
      rate = doc.data().rate;
      name = doc.data().name;
      street = doc.data().street;
      state = doc.data().name;
      postal = doc.data().postal;
      picture = doc.id;
      ReviewID= picture
    allDocs.push(doc.data())
  });
  
  

  //pull picture link
  //note some revied do not have picture 
  const p = query(collection(db, "images-alpha"), where("reviewid", "==", ReviewID));
  const PicturequerySnapshot = await getDocs(p);
  PicturequerySnapshot.forEach((doc) => {
          
      picturelink = doc.data().link;
      console.log("link =" , picturelink);
  });
  
  



  //do something for one review data 
  
  //comment = review text
  //name = review title
  //rate = rate (1-5)
  //picturelink = picture link

  
}
console.log(allDocs)

const getLowestReview = (allDocs) => {
    let lowest = 1
    let lowestReview = null
    allDocs.forEach(doc => {
        if (doc.rate <= lowest) {
            lowest = doc.rate
            lowestReview = doc
        }
    });
    console.log(lowestReview)
    return lowestReview
}


var losebtn = document.getElementById("losebtn")
var popupbox = document.getElementsByClassName("popupbox")[0]
var mapContainer = document.getElementsByClassName('map-container closed')[0]

losebtn.onclick = () => {
    popupbox.className = 'popupbox opened'
    popupbox.style.zIndex = 
    console.log("opened pop up")
}

var closebtn = document.getElementById('close-btn')
closebtn.onclick = () => {
    popupbox.className = 'popupbox closed'
    mapContainer.className = 'map-container closed'
}

var claimbtn = document.getElementById('claim-btn')

claimbtn.onclick = () => {
    mapContainer.className = 'map-container opened'
    getLowestReview(allDocs)
    // fill in the mapbox controls box with beginning and end locations
    
    // beginning is longitude and latitude of current location
    // end is the lowest review doc
}


