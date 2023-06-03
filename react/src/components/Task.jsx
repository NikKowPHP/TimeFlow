import React, { useEffect } from "react";
import { useState } from "react";
import axiosClient from "../axios-client";

export default function Task({data}) {

  return (
            <li>
              <span className="task-time">{data.timeStart} - {data.timeEnd}</span>
              <span className="task-title">{data.title}</span>
            </li>
  );
}
