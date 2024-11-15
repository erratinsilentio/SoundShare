import axios from "axios";
import { nanoid } from "nanoid";
import { NextRequest, NextResponse } from "next/server";

export default async function handler(req: NextRequest, res: NextResponse) {
  // generate new url with nanoid
  // store it in db
  // return short url to client
}
