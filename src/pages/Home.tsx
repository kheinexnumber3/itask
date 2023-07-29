import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonContent,
  IonFab,
  IonFabButton,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonModal,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import ExploreContainer from "../components/ExploreContainer";
import "./Home.css";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { add } from "ionicons/icons";

const Home: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle className="title-main">iTask</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <RenderCard />
      </IonContent>
      <Addbutt></Addbutt>
    </IonPage>
  );
};

export default Home;

function RenderCard() {
  const url = "http://itaskapp.onlinewebshop.net/api/";
  const [data, setData] = useState<any[]>([]);
  const fetchData = async () => {
    const result = await axios.post(`${url}gettask`);
    console.log(result.data.payload);
  };
  fetchData();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post(`${url}gettask`);
        console.log(response.data.payload);
        setData(response.data.payload);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const getData = async () => {
    try {
      const response = await axios.post(`${url}gettask`);
      console.log(response.data.payload);
      setData(response.data.payload);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const deleteTask = async(id:any)=>{
    try {
      const response = await axios.post(`${url}deletetask`, {payload:{id:id}})
      console.log(response.data.payload);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    getData()
  }

  return (
    <>
      {data == null ? <p>NO TASK AVAILABLE</p>: data.map((dataTask) => (
        <IonCard key={dataTask.id}>
          <IonCardHeader>
            <IonCardTitle className="task-title">{dataTask.task}</IonCardTitle>
            <IonCardSubtitle>{dataTask.date}</IonCardSubtitle>
          </IonCardHeader>
          <IonButton color="success" fill="clear" onClick={()=>deleteTask(dataTask.id)}>DONE TASK</IonButton>
        </IonCard>
      ))}
    </>
  );
}

function Addbutt() {
  const modal = useRef<HTMLIonModalElement>(null);
  const url = "http://itaskapp.onlinewebshop.net/api/";
  const [data, setData] = useState('');

  const handleChange = (event: any) => {
    setData(event.target.value);
    console.log(event.target.value);
  };

  const dismiss=()=>{
    modal.current?.dismiss()
  }

  const createTask = async (t: any) => {
    if (t == '') {
      dismiss()
      return
    }
    try {
      const response = await axios.post(`${url}createtask`, {
        payload: { task: t },
      });
      console.log(response.data.payload);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    history.go(0)
  };
  return (
    <>
      <IonFab slot="fixed" vertical="bottom" horizontal="end">
        <IonFabButton id="open-modal">
          <IonIcon icon={add}></IonIcon>
        </IonFabButton>
      </IonFab>
      <IonModal
        ref={modal}
        trigger="open-modal"
        initialBreakpoint={1}
        breakpoints={[0, 1]}
      >
        <div className="block create-task">
          <IonItem className="input">
            <IonInput
              className="input-text"
              label="CREATE A NEW TASK"
              labelPlacement="stacked"
              clearInput={true}
              placeholder="e.g Finish House Chores..."
              onInput={handleChange}
            ></IonInput>
          </IonItem>
          <IonButton expand="block" onClick={() => data == '' ? dismiss() : createTask(data)}>
            Add New Task
          </IonButton>
        </div>
      </IonModal>
    </>
  );
}
