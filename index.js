const express = require("express");
const app = express();

app.use(express.json());

let baseCalorieBurn = 1500;
let reportArr = [];
let calorieTracker = [];

function calcSurplusDeficit(burnt, intake){
       return burnt - (intake + baseCalorieBurn);
}

app.post("/addCalorie", (req, res)=>{
       let burnt = req.body.burnt;
       let intake = req.body.intake;

       calorieTracker.push({burnt, intake});

       res.json({
        message: "calories for the day added successfully"
       });
})


app.get("/generateDailyReport", (req, res)=>{
      let dayIndex = req.headers.day - 1;

      let {burnt, intake} = calorieTracker[dayIndex];

      let surplus = calcSurplusDeficit(burnt, intake);


      let report = `Day ${req.headers.day}: Surplus/Deficit: ${surplus > 0 ? surplus + "  (Surplus)" : surplus + " (Deficit)"}`;

      reportArr.push({report});

      res.send(
        report
      );
})

app.get("/getAllReport", (req, res)=>{

    res.json(reportArr);
})


app.get("/generateWeeklyReport", (req, res)=>{
      
    let totalCaloriesBurnt = 0;
    let totalCaloriesIntake = 0;

    for(let calories of calorieTracker){
        totalCaloriesBurnt += calories.burnt;
        totalCaloriesIntake += calories.intake;
    }

    let totalSurplus = totalCaloriesBurnt - (totalCaloriesIntake + (5*baseCalorieBurn));

    let status = totalSurplus > 0 ? "(Surplus)" : "(Deficit)";

    let award = totalCaloriesBurnt > 1000 ? "Congratulations! You have kept moving throughout. keep it up!" : "No Award yet!";

    let weeklySummary = `Weekly Summary:
    Total Calories Burnt: ${totalCaloriesBurnt} calories
    Total Calories Intake: ${totalCaloriesIntake} calories
    Total Surplus/Deficit: ${totalSurplus} ${status}

    Award:
    ${award}`;

    res.send(weeklySummary);

})




app.listen(3000);