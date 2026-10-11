import carModel from "../models/carModel.js";

// Add Car
export const addCar = async (req, res) => {
    try {
        const {
            name,
            about,
            year,
            seats,
            milage,
            fuel,
            category,
            price,
            image,
            status,
            transmission,
            model
        } = req.body;

        if (
            !name ||
            !about ||
            !year ||
            !seats ||
            !milage ||
            !fuel ||
            !category ||
            !price ||
            !model
        ) {
            return res.status(400).send({
                success: false,
                message: "Please provide all required fields"
            });
        }

        // Image validation
        if (!req.file) {
            return res
            .status(404)
            .send({ success: false,
                message: "Please add image file"
            });
        }
        const photoBase64 = req.file.buffer.toString("base64");
        const isTransmissionAutomatic = typeof transmission === "string"
            ? transmission.toLowerCase() === "automatic" || transmission === "true"
            : Boolean(transmission);

        const car = new carModel({
            name,
            about,
            year,
            seats,
            milage,
            fuel,
            category,
            price,
            image: photoBase64,
            status,
            transmission: isTransmissionAutomatic,
            model
        });

        await car.save();

        return res.status(201).send({
            success: true,
            message: "Car has been created",
            car
        });

    } catch (error) {
        console.log(error);

        return res.status(500).send({
            success: false,
            message: "Error in add car API",
            error: error.message
        });
    }
};


// All Cars
export const getAllCars = async (req, res) => {
    try {
        const car = await carModel.find({});
        res.status(200).send({
            success: true,
            message: "All  Cars",
            totalCar: car.length,
            car,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in get all Car API",
            error,
        });
    }
};

// Get Car by ID 
export const getCarDetails = async (req, res) => {
    try {
        const {id} = req.params
        if (!id) {
            return res.status(404).send({
                success: false,
                message: "Car ID is not found"
            })
        }
        const car = await await carModel.findById({_id:id});
        if (!car) {
            return res.status(404).send({
                success: false,
                message: "No car found with this id",
            });
        }
        res.status(200).send({
            success: true,
            message: "Car details fetched successfully",
            car
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in Car details API",
            error,
        });
    }
}

// Update
export const updateCar = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(404).send({
                success: false,
                message: "Car Id not found",
            });
        }
        const data = { ...req.body };
        if (Object.hasOwn(data, "transmission")) {
            data.transmission = typeof data.transmission === "string"
                ? data.transmission.toLowerCase() === "automatic" || data.transmission === "true"
                : Boolean(data.transmission);
        }
        if (req.file) {
            data.image = req.file.buffer.toString("base64");
        }
        const car = await carModel.findByIdAndUpdate(
            id, 
            { $set: data},
            { new: true, runValidators: true }
        );
        res.status(200).send({
            success: true,
            message: "Car has been updated",
            car,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in car update API",
            error,
        });
    }
}

// Delete Car
export const deleteCar = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(404).send({
                success: false,
                message: "Car Id Not Found",
            })
        }
        await carModel.findByIdAndDelete({_id: id});
        res.status(200).send({
            success: true,
            message: "Car has been Deleted"
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in car Deletion API",
            error,
        });
    }
}
