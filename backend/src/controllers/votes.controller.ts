import { BadRequestError } from "@/errors/BadRequestError";
import { PictureModel } from "@/models/picture";
import { Request, Response } from "express";
import _ from "underscore"

export const createMatch = async (req: Request, res: Response) => {
    const loggedUser = req.loggedUser!

    const numPictures = await PictureModel.count({
        where: {
            userId: {
                not:  loggedUser.id
            }
        }
    })

    if(numPictures < 2){
        throw new BadRequestError("Not enought pictures for match")
    }
    const randomNumPic1 = _.random(numPictures - 1)

    const picture1 = await PictureModel.findFirst({
        where: {
            userId: {
                not:  loggedUser.id
            }
        },
        skip: randomNumPic1,
    })
    if(!picture1){
        throw new BadRequestError("Not enought pictures for match")
    }

    const randomNumPic2 = _.random(numPictures - 2)

    const picture2 = await PictureModel.findFirst({
        where: {
            AND: [
                {
                    userId: {
                        not: loggedUser.id
                    }
                },
                {
                    id: {
                        not: picture1.id
                    }
                }
            ]
        },
        skip: randomNumPic2,
    })
    if(!picture2){
        throw new BadRequestError("Not enought pictures for match")
    }

    res.status(200).send()
}