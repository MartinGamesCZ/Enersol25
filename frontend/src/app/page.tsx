"use client";

import { Button } from "@/components/ui/button";
import { SRVIP } from "@/config";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";

export default function Page() {
  const [charging, setCharging] = useState(false);
  const [charge, setCharge] = useState(0);

  useEffect(() => {
    (async () => {
      const data = await getData();

      setCharging(data.charging);
      setCharge(data.charge);
    })();

    const i = setInterval(async () => {
      const data = await getData();

      setCharging(data.charging);
      setCharge(data.charge);
    }, 100);

    return () => clearInterval(i);
  }, []);

  const toggleCharging = useCallback(async () => {
    await axios.get(`${SRVIP}/set/charging?charging=${charging ? "0" : "1"}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await getData();

    setCharging(data.charging);
  }, [charging]);

  return (
    <div className="w-screen h-screen p-64">
      <h1 className="text-4xl font-bold">Gravitační baterie</h1>
      <div>
        <p>Nabito na {charge}%</p>
        <Button onClick={toggleCharging}>
          {!charging ? "Zapnout" : "Vypnout"} nabíjení
        </Button>
      </div>
    </div>
  );
}

async function getData() {
  const req = await axios.get(`${SRVIP}/data`);

  return req.data;
}
