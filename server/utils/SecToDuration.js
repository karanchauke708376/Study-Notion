// export const CalculateCourseTime = (ContentArr) => {  

//     // console.log("contenArr",ContentArr)
//     if(ContentArr.length <= 0 )
//     {
//        return "Not Found"
//     }
//   let TotalTimeInSec = 0
//   for(let x of ContentArr)
//    {  for (let y of x.subSection)
//       TotalTimeInSec += Number(y.timeDuration);
//         }
//     let second=0, hour=0, minutes=0 ;
// // calculate min 
//    minutes = Math.floor(TotalTimeInSec/60);
//    second = Math.floor(TotalTimeInSec%60);
//    hour = Math.floor(minutes/60);
//    let remainMin = Math.floor(minutes%60);
//    minutes  = remainMin 
//    return `${hour}h:${minutes}Min:${second}Sec`
// } 

// Helper function to convert total seconds to the duration format
function convertSecondsToDuration(totalSeconds) {
   const hours = Math.floor(totalSeconds / 3600)
   const minutes = Math.floor((totalSeconds % 3600) / 60)
   const seconds = Math.floor((totalSeconds % 3600) % 60)
 
   if (hours > 0) {
     return `${hours}h ${minutes}m`
   } else if (minutes > 0) {
     return `${minutes}m ${seconds}s`
   } else {
     return `${seconds}s`
   }
 }
 
 module.exports = {
   convertSecondsToDuration,
 }