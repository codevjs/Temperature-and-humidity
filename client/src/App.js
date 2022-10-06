import { useSubscription, useMqttState } from 'mqtt-react-hooks';
import './App.css';
import {useState} from "react";

function App() {

    const [currentTemp, setCurrenTemp] = useState(20);
    const { connectionStatus }         = useMqttState();

    const temperature = useSubscription('dht11/sensor/temperature/state');
    const humidity    = useSubscription('dht11/sensor/humidity/state');

    const remote = async (entity) => {
        try {

            const purl = "https://smarthome.orderindonesia.com/api/services/scene/turn_on"
            // const url  = "http://192.168.0.26:8123/api/services/scene/turn_on";

            const headers = new Headers();

            headers.append("Authorization", "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiI5MjIyZDY5NWM3ODA0MDhmOTE2NDk0MjZjMWQ3YWNjZSIsImlhdCI6MTY2MjY0NTU0MiwiZXhwIjoxOTc4MDA1NTQyfQ.9EZJoB4jP_a8rmE2efhZtUYkTPQiKFlHvP3DGRHhcJ4");
            headers.append("Content-Type", "application/json");

            const raw = JSON.stringify({"entity_id" : entity});

            const requestOptions = {
                method: 'POST',
                headers: headers,
                body: raw,
            };

            const response = await fetch(purl, requestOptions)

            const result = await response.json();

            console.log(result);

            if (result.length < 1) {

                throw Error("Coba lagi")
            }
        }catch (e) {


            throw Error(e.message)
        }
    }

    const changeTemp = async (val) => {
        try {
            if (val === -1 && currentTemp <= 16)
                return

            if (val === 1 && currentTemp >= 28)
                return;

            await remote(`scene.ac_${currentTemp + val}`);

            setCurrenTemp(cur => cur + val)
        } catch (e) {

            alert(e.message)
        }
    }

  return (
      <div className="container overflow-hidden">
        <div className="flex flex-row justify-center pt-0">
          <div className="circle-track rounded-full">
            <div className="circle-progress rounded-full flex justify-center items-center">
              <div className="circle-inner bg-white rounded-full flex justify-center items-center">
                {/*<div className="pointer app-bg-color-black h-1 w-1 rounded-full"/>*/}
                <span className="text-5xl font-light app-color-black">{temperature?.message?.message || 0}°</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-between px-12">
          <span className="text-2xl font-light app-color-blue">{temperature?.message?.message || 0}°</span>
          <span className="text-2xl font-light app-color-red">{humidity?.message?.message || 0}%</span>
        </div>
        <div className="flex flex-col justify-center items-center">
          <span className="app-color-purple">°</span>
          <span className="app-font-sm tracking-widest app-color-purple -mt-2">{connectionStatus}</span>
        </div>

        <div className="flex flex-row px-6 mt-4 justify-between">
          <div onClick={() => changeTemp(-1)} style={{cursor : "pointer"}} className="flex flex-col h-36 w-20 items-center justify-between py-4 rounded-2xl">
            <i className="fa-solid fa-minus text-3xl app-color-purple"/>
            <span className="app-font-md font-semibold app-color-purple tracking-widest">&nbsp;</span>
          </div>
            <div className="flex flex-col bg-white h-36 w-20 items-center justify-between py-4 rounded-2xl app-shadow">
                <i style={{cursor : "pointer", color : "red"}} onClick={async () => {
                    try {
                        await remote(`scene.ac_on_off`)
                    } catch (e) {

                        alert(e.message)
                    }
                }} className="fa-solid fa-power-off text-3xl app-color-red"/>
                <span style={{fontSize : 20}} className="app-font-md font-semibold app-color-black tracking-widest">
                    {currentTemp}°
                </span>
            </div>
          <div onClick={() => changeTemp(1)} style={{cursor : "pointer"}} className="flex flex-col h-36 w-20 items-center justify-between py-4 rounded-2xl">
              <i className="fa-solid fa-plus text-3xl app-color-purple"/>
              <span className="app-font-md font-semibold app-color-purple tracking-widest">&nbsp;</span>
          </div>
        </div>
          <div style={{textTransform :"uppercase"}} className="text-center mt-6 app-font-md font-semibold app-color-black tracking-widest">humidity</div>
          <div className="flex justify-center mt-2">
              <div className="w-px h-3 bg-gray-400"/>
          </div>
          <div className="flex justify-between px-6 mt-6">
              <i className="fa-regular fa-clone app-color-black"/>
              <i className="fa-solid fa-repeat app-color-black"/>
          </div>
          <div className="flex justify-center relative">
              <div className="w-48 h-48 bg-red-500 transform rotate-45 power-bg"/>
              <span style={{marginTop : "70px"}} className="absolute text-5xl font-light app-color-black">{humidity?.message?.message || 0}%</span>
              {/*<i className="fa-solid fa-power-off absolute text-3xl app-color-black"/>*/}
          </div>
      </div>
  );
}

export default App;
