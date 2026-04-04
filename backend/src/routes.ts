import express from "express";
import { UserController } from "./controller/user.controller";
import { checkUser } from "./protect-routes";
import { LocationController } from "./controller/location.controller";
import { DonorController } from "./controller/donor.controller";
import { DonationController } from "./controller/donation.controller";

export function getRoutes() {
    const router = express.Router();
    const userController = new UserController();

    router.get("/users", userController.getAll);
    router.get("/users/:id", userController.getOne);
    router.post("/users", userController.create);
    router.post("/users/login", userController.login);
    router.put("/users", checkUser, userController.update);
    router.delete("/users/:id", checkUser, userController.delete);

    // Locations
    const locationController = new LocationController();
    router.get("/locations", locationController.getAll);
    router.get("/locations/:id", locationController.getOne);
    router.post("/locations", checkUser, locationController.create);
    router.put("/locations", checkUser, locationController.update);
    router.delete("/locations/:id", checkUser, locationController.delete);
    router.patch("/locations/:id/toggle", checkUser, locationController.toggleActive);

    // Donors
    const donorController = new DonorController();
    router.get("/donors", donorController.getAll);
    router.get("/donors/:id", donorController.getOne);
    router.post("/donors", checkUser, donorController.create);
    router.put("/donors", checkUser, donorController.update);
    router.delete("/donors/:id", checkUser, donorController.delete);

    // Donations
    const donationController = new DonationController();
    router.get("/donations", donationController.getFiltered); // Note: using getFiltered to get eligible donations
    router.get("/donations/all", donationController.getAll);
    router.get("/donations/:id", donationController.getOne);
    router.post("/donations", checkUser, donationController.create);
    router.put("/donations", checkUser, donationController.update);
    router.delete("/donations/:id", checkUser, donationController.delete);

    return router;
}
