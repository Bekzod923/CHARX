import { AccidentPhoto, DAMAGED_PART_LABELS, DamagedPart } from "@/lib/types";

const PART_TO_PHOTO: Record<DamagedPart, string> = {
  front_bumper: "front-bumper.svg",
  rear_bumper: "rear-bumper.svg",
  hood: "hood-dent.svg",
  roof: "roof-dent.svg",
  trunk: "rear-bumper.svg",
  left_front_door: "door-dent.svg",
  left_rear_door: "door-dent.svg",
  right_front_door: "door-dent.svg",
  right_rear_door: "door-dent.svg",
  left_front_fender: "fender-scratch.svg",
  right_front_fender: "fender-scratch.svg",
  left_rear_fender: "fender-scratch.svg",
  right_rear_fender: "fender-scratch.svg",
  windshield: "windshield-crack.svg",
};

/** Derives placeholder photo records from a set of damaged parts (max 3). */
export function derivePhotosFromParts(parts: DamagedPart[]): AccidentPhoto[] {
  return parts.slice(0, 3).map((part, idx) => ({
    id: `photo_${Date.now()}_${idx}`,
    url: `/damage-photos/${PART_TO_PHOTO[part]}`,
    caption: `${DAMAGED_PART_LABELS[part]} — зафиксированные повреждения`,
  }));
}
