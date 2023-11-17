"use client";

import Chatmsg from "@/components/Chatmsg";
import Chatbar from "@/components/Chatbar";
import Audio from "@/components/Audio";
import Convo from "@/components/JoinRooms";
import { useState } from "react";
import { ConvoProps } from "@/components/JoinRooms";

export default function page() {
  return (
    <div className="flex h-full text-white">
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 overflow-x-hidden overflow-auto flex items-center justify-center">
          <div className="border p-16 rounded-md bg-primecl border-quatrocl">
            <h2 className="text-center">
              Select a chat or start a new conversation with one of your friends
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
}
