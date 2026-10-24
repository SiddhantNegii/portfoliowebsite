// All site text lives in /content.json. This file only reshapes it for the code.
import content from '../content.json';

export const SITE = content.site;
export const PROFILE = content.profile;
export const EXTRAS = content.hoverLabels;
export const ROOM = content.room;
export const ROOM_ORDER = Object.keys(ROOM);

export const ARCADE_CHANNELS = ROOM.arcade.sections
  .filter((s) => s.chips?.length)
  .map((s) => ({ name: s.h, items: s.chips, more: s.more }));

export const PROJECTS = ROOM.monitor.sections.flatMap((s) => s.items ?? []);
