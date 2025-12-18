import { appConfig } from "../config/config";
import { Observable } from 'rxjs';
let tzlookup = require("tz-lookup");

export const GLOBALF = {
    findInvalidControls(form_controls:any) {
        const invalid = [];
        const controls = form_controls;
        for (const name in controls) {
            if (controls[name].invalid && name != "phone") {
                invalid.push(name);
            }
        }
        console.log('INVALID FIELD::',invalid);
    },
    SetLocalOrderDetails(orders:any){
        localStorage.setItem(appConfig.storage.ORDER_DETAIL,JSON.stringify(orders));
    },
    getLocalOrderDetails() {
        let getJSON = localStorage.getItem(appConfig.storage.ORDER_DETAIL);
        if (getJSON){
            let received = JSON.parse(getJSON)
            return received;
        }
    },
    SetLocalOrderItem(orders:any){
        localStorage.setItem(appConfig.storage.ORDER_ITEM,JSON.stringify(orders));
    },
    getLocalOrderItem() {
        let getJSON = localStorage.getItem(appConfig.storage.ORDER_ITEM);
        if (getJSON){
            let received = JSON.parse(getJSON)
            return received;
        }
    },
    SetLocalCategory(cat:any){
        localStorage.setItem(appConfig.storage.CATEGORY,JSON.stringify(cat));
    },
    getLocalCategory() {
        let getJSON = localStorage.getItem(appConfig.storage.CATEGORY);
        if (getJSON){
            let received = JSON.parse(getJSON)
            return received;
        }
    },
    getLocalUserData() {
        let getJSON = localStorage.getItem(appConfig.storage.USER_DATA);
        if (getJSON){
            let received = JSON.parse(getJSON)
            return received;
        }
    },
    SetLocalUserData(user:any){
        localStorage.setItem(appConfig.storage.USER_DATA,JSON.stringify(user));
    },
    SetLocalUserPermission(permit:any){
        localStorage.setItem(appConfig.storage.PERMISSIONS,JSON.stringify(permit));
    },
    getLocalUserPermission() {
        let getJSON = localStorage.getItem(appConfig.storage.PERMISSIONS);
        if (getJSON){
            let received = JSON.parse(getJSON)
            return received;
        }
    },
/*    
    SetLocalEventsData(events:any){
        localStorage.setItem(appConfig.storage.EVENTS_DATA,JSON.stringify(events));
    },
    SetLocalGuestsData(guests:any){
        localStorage.setItem(appConfig.storage.GUESTS_DATA,JSON.stringify(guests));
    },
    GetLocalGuestsData(){
        let getJSON = localStorage.getItem(appConfig.storage.GUESTS_DATA);
        if (getJSON){
            let received = JSON.parse(getJSON)
            return received;
        }else{
            return false;
        }
    },
    getLocalEventsData() {
        let getJSON = localStorage.getItem(appConfig.storage.EVENTS_DATA);
        if (getJSON){
            let received = JSON.parse(getJSON)
            return received;
        }
    }
   
    getCartItems() {
        let getJSON = localStorage.getItem('cartItems');
        if (getJSON){
            let received = JSON.parse(getJSON)
            return received;
        }
    },
    getEventSearchSuggestions(query:string,limit:number) {
        let getJSON = localStorage.getItem(appConfig.storage.EVENTS_DATA);
        if (getJSON){
            let received = [];
            received = JSON.parse(getJSON);
            received.filter((a:any) =>{

            })

            return received;
        }
    },
    getLocalEventById(id:any) {
        console.log("event id::",id);
        let getJSON = localStorage.getItem(appConfig.storage.EVENTS_DATA);
        if (getJSON){
            let received = JSON.parse(getJSON)
            console.log("events::",received);
            const studentsObservable = new Observable(observer => {
                setTimeout(() => {
                    observer.next(received);
                }, 1000);
            });
        }
    } 
    ,*/
    randomToken() {
        let result = '';
        let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let charactersLength = characters.length;
        for (let i = 0; i < 8; i++ ) {
          result += characters.charAt(Math.floor(Math.random()*charactersLength));
        }
        return result;
    },
     //timeZone based on offset of the select location from google field
    timeZone(offset:any){
        let _offset = offset/60;
        return "UTC"+_offset; //e.g. +1 this is based on the location selected from the google location drop down.

    },
    //Time zone selected from the location field
    selectedTimezone(lat:any, long:any){
        let selected_timezone = tzlookup(lat, long); //e.g. "America/New_York"
      //  return selected_timezone;
        return this.getshortTimeZone(selected_timezone);
    },
    /*selectedTimezoneAbbrev(_zone:string){
        const abbr_timezone = DateTime.fromObject({year: 2022, month: 12, zone:_zone})
        .toFormat('ZZZZ');
        return abbr_timezone //e.g. WAT,EST
    },
    */
    //timeZoneAbrreviation of current location
    timeZoneAbrreviation(){
        var zone = new Date().toLocaleTimeString(undefined,{timeZoneName:'short'}).split(' ')[2]
        return zone;        //standard world timezone e.g. GMT+1
    },

    //currentLocationOffset of current location
    currentLocationOffset() {
        let date = new Date();  
        let offset = date.getTimezoneOffset();
        return offset; // this is based on current location timezone
    },
    //timeZoneLocale of current location
    timeZoneLocale(){
        let d = new Date(); // or whatever date you have
      //  let tzName = d.toLocaleString('en', {timeZoneName:'short'}).//split(' ').pop();
        //let tzName = d.toTimeString()
      //  return tzName;
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        return timezone; //e.g. Africa/Lagos
    },
   
    getshortTimeZone(tz:any){
       let short_tz:any;
       //getshortTimeZone of current location
      // let tz = this.timeZoneLocale();
       //getshortTimeZone of the selected location
      
       if(tz ===  "Africa/Algiers"||
       tz === "Africa/Bangui"||
       tz === "Africa/Brazzaville"||
       tz === "Africa/Douala"||
       tz === "Africa/Kinshasa"||
       tz == "Africa/Lagos"||
       tz === "Africa/Libreville"||
       tz === "Africa/Luanda"||
       tz === "Africa/Malabo"||
       tz === "Africa/Ndjamena"||
       tz === "Africa/Niamey"||
       tz === "Africa/Porto-Novo"||
       tz === "Africa/Tunis"){
         short_tz = 'WAT';
         
       }
       else if(tz === "America/Anchorage"||
       tz === "America/Juneau"||
       tz === "America/Nome"||
       tz === "America/Sitka"||
       tz === "America/Yakutat"){
        short_tz = 'AKDT';
       }
       else if(tz ==="America/Santa_Isabel"){
        short_tz = 'PDT';
       }
       else if(tz === "America/Los_Angeles"||
       tz === "America/Tijuana"||
       tz === "America/Vancouver"){
        short_tz = 'PDT';
       }
       else if(tz ===  "America/Creston"||
       tz === "America/Dawson"||
       tz === "America/Dawson_Creek"||
       tz === "America/Hermosillo"||
       tz === "America/Phoenix"||
       tz === "America/Whitehorse"){
        short_tz = 'UMST';
       }
       else if(tz === "America/Boise" ||
       tz === "America/Cambridge_Bay"||
       tz === "America/Denver"||
       tz === "America/Edmonton"||
       tz === "America/Inuvik"||
       tz === "America/Ojinaga"||
       tz === "America/Yellowknife"){
        short_tz = 'MDT';
       }
       else if(tz === "America/Detroit" ||
       tz === "America/Havana"||
       tz === "America/Indiana/Petersburg"||
       tz === "America/Indiana/Vincennes"||
       tz === "America/Indiana/Winamac"||
       tz === "America/Iqaluit"||
       tz === "America/Kentucky/Monticello"||
       tz === "America/Louisville"||
       tz === "America/Montreal"||
       tz === "America/Nassau"||
       tz === "America/New_York"||
       tz === "America/Nipigon"||
       tz === "America/Pangnirtung"||
       tz === "America/Port-au-Prince"||
       tz === "America/Thunder_Bay"||
       tz === "America/Toronto"){
        short_tz = 'EST';
       }
       else{
        short_tz = tz;
       }
       return short_tz;
    },

    ValidateEmail(input:string) {
        var validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
      
        if (input.match(validRegex)) {
          return true;
      
        } else {   
          return false;
      
        }   
    },
    generateRefCode() {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789";  
        for (var i = 0; i < 6; i++)
          text += possible.charAt(Math.floor(Math.random() * possible.length));
          //let radar =  'radar';
          return text;
    },
    randomDigits(){
        return Math.floor(100000 + Math.random() * 900000);
    },
    autoReferralCode(){
        let characters = 'abcdefghijklmnopqrstuvwxyz0123456789'.toUpperCase();
        let result = ""
        let charactersLength = characters.length;

        for ( var i = 0; i < 5 ; i++ ) 
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
            return result;
        
    },
    generateOrderNumber() {
        let order_no = "";
        let possible = "0123456789";  
        for (let i = 0; i < 8; i++)
        order_no += possible.charAt(Math.floor(Math.random() * possible.length));
          return order_no;
    },
    generateProductCode() {
        let order_no = "";
        let possible = "0123456789";  
        for (let i = 0; i < 10; i++)
        order_no += possible.charAt(Math.floor(Math.random() * possible.length));
        let code = 'SK'+order_no;
        return code;
    },
    todayDate(){
        //yyyy-mm-dd format
        let formatedDate = new Date().toISOString().slice(0, 10);
        return formatedDate;
    },
    currentTime(){
        let d = new Date();
        let formattedTime = d.toLocaleTimeString('en-US', { hour12: true });
        return formattedTime;
    },
    currentWeekNumber(){
        let currentDate:any = new Date();
        let startDate:any = new Date(currentDate.getFullYear(), 0, 1);
         let days = Math.floor((currentDate - startDate) /
             (24 * 60 * 60 * 1000));
              
         var weekNumber = Math.ceil(days / 7);
         return weekNumber;
    },
    getWeekofSpecificDate(date:string){
        let currentDate:any = new Date(date);
        let startDate:any = new Date(currentDate.getFullYear(), 0, 1);
         let days = Math.floor((currentDate - startDate) /
             (24 * 60 * 60 * 1000));
              
         var weekNumber = Math.ceil(days / 7);
            
        /// console.log("Week number of " + currentDate +
        //     " is :   " + weekNumber);
        return weekNumber;
    },
    isNumberOnly(data:any){
        let isNumber = /^\d+$/.test(data);
        return isNumber;
    },
    //get the first two word in the comma separated string
    getFirstWordInString(str:any){
      let pos = str.indexOf( ',' );
      return str.substring( 0, pos );
    },
    autoGenerateTags(sentence:any){
        let titleArray = sentence.split(' ');
        titleArray = titleArray.filter((x:any) => x.toLowerCase() !== 'the');
        titleArray = titleArray.filter((x:any) => x.toLowerCase() !== 'or');
        titleArray = titleArray.filter((x:any) => x.toLowerCase() !== 'and');
        titleArray = titleArray.filter((x:any) => x.toLowerCase() !== 'of');
        titleArray = titleArray.filter((x:any) => x.toLowerCase() !== 'in');
        titleArray = titleArray.filter((x:any) => x.toLowerCase() !== 'at');
        titleArray = titleArray.filter((x:any) => x.toLowerCase() !== 'is');
        titleArray = titleArray.filter((x:any) => x.toLowerCase() !== 'from');
        titleArray = titleArray.filter((x:any) => x.toLowerCase() !== 'since');
        titleArray = titleArray.filter((x:any) => x.toLowerCase() !== 'until');
        titleArray = titleArray.filter((x:any) => x.toLowerCase() !== 'up');
        titleArray = titleArray.filter((x:any) => x.toLowerCase() !== 'with');
        titleArray = titleArray.filter((x:any) => x.toLowerCase() !== 'within');
        titleArray = titleArray.filter((x:any) => x.toLowerCase() !== 'without');
        titleArray = titleArray.filter((x:any) => x.toLowerCase() !== 'i');
        titleArray = titleArray.filter((x:any) => x.toLowerCase() !== 'to');
        titleArray = titleArray.filter((x:any) => x.toLowerCase() !== "it");
        titleArray = titleArray.filter((x:any) => x.toLowerCase() !== "it's");
        titleArray = titleArray.filter((x:any) => x.toLowerCase() !== 'its');
        titleArray = titleArray.filter((x:any) => x.toLowerCase() !== 'that');
        titleArray = titleArray.filter((x:any) => x.toLowerCase() !== 'good');
        titleArray = titleArray.filter((x:any) => x.toLowerCase() !== 'am');
        titleArray = titleArray.filter((x:any) => x.toLowerCase() !== 'how');
        titleArray = titleArray.filter((x:any) => x.toLowerCase() !== 'why');
        titleArray = titleArray.filter((x:any) => x.toLowerCase() !== 'not');

        return titleArray;
    }

    
}