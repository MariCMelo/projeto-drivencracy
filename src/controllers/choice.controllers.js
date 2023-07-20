import { db } from "../database/db.connection.js";
import { ObjectId } from "mongodb";

export async function createChoice(req, res) {
    const { title, pollId } = req.body;

    try {

        const poll = await db
            .collection("polls")
            .findOne({ _id: new ObjectId(pollId) });

        if (!poll) {
            return res.status(404).json({ error: "Enquete não encontrada." });
        }

        if (!title) {
            return res.status(422).json({ error: "O título não pode ser vazio." });
        }

        const existingChoice = await db
            .collection("choices")
            .findOne({ pollId, title });

        if (existingChoice) {
            return res.status(409).json({ error: "Essa opção de voto já existe na enquete." });
        }

        if (poll.expireAt < new Date()) {
            return res.status(403).json({ error: "A enquete já expirou." });
        }

        const choice = {
            title,
            pollId,
        };

        await db.collection("choices").insertOne(choice);

        res.status(201).json(choice);

    } catch (err) {
        res.status(500).send(err.message);
    }
}

export async function voteOnChoice(req, res) {
    const { id } = req.params;

    try {
        const poll = await db
            .collection("polls")
            .findOne({ _id: ObjectId(id) });

        if (!poll) {
            return res.status(404).json({ error: 'Enquete não encontrada.' });
        }

        const choices = await db
            .collection("choices")
            .find({ pollId: id })
            .toArray();

        res.json(choices);

    } catch (err) {
        res.status(500).send(err.message)
    }
}
