import { Module } from "@medusajs/framework/utils"
import ParkModuleService from "./service"

export const PARK_MODULE = "park"

export default Module(PARK_MODULE, {
    service: ParkModuleService,
})