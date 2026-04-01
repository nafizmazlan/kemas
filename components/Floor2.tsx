"use client";

import { STATUS_COLORS } from "@/lib/constants";
import { RoomWithLastLog } from "@/types";

interface FloorProps {
  rooms: RoomWithLastLog[];
  onRoomClick: (room: RoomWithLastLog) => void;
}

export default function Floor2({ rooms, onRoomClick }: FloorProps) {
  const getRoom = (name: string) => rooms.find((room) => room.name === name);

  const roomDefs = [
    { name: "Room 2", x: 40, y: 40, w: 230, h: 240 },
    { name: "Shared Toilet", x: 270, y: 120, w: 120, h: 140 },
    { name: "Room 1", x: 390, y: 40, w: 150, h: 240 },
    { name: "Living Room 2F", x: 40, y: 280, w: 350, h: 150 },
    { name: "Master Bedroom", x: 40, y: 430, w: 390, h: 170 },
    { name: "Master Toilet", x: 430, y: 470, w: 110, h: 130 },
  ];

  return (
    <svg viewBox="0 0 580 650" className="h-auto w-full rounded-3xl bg-white">
      <rect x="20" y="20" width="540" height="600" className="wall-outer" />

      {roomDefs.map((shape) => {
        const room = getRoom(shape.name);
        if (!room) return null;

        return (
          <g key={shape.name} onClick={() => onRoomClick(room)}>
            <rect
              x={shape.x}
              y={shape.y}
              width={shape.w}
              height={shape.h}
              fill={STATUS_COLORS[room.status]}
              className="room-shape"
              stroke="#1f2937"
              strokeWidth="2"
              rx="2"
            />
            <text
              x={shape.x + shape.w / 2}
              y={shape.y + shape.h / 2}
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-neutral-900 text-[14px] font-medium"
            >
              {shape.name}
            </text>
          </g>
        );
      })}

      <rect
        x="390"
        y="280"
        width="150"
        height="150"
        fill="#f5f5f4"
        stroke="#1f2937"
        strokeWidth="2"
        strokeDasharray="6 4"
      />
      <text x="465" y="360" textAnchor="middle" className="fill-neutral-500 text-[12px]">
        Stair landing
      </text>
    </svg>
  );
}