import { ObjectId } from "mongodb";
import { db } from "../database/db.connection.js";

export async function createPoll(req, res) {
  const { title, expireAt } = req.body;

  try {
    const defaultExpiration = new Date();
    defaultExpiration.setDate(defaultExpiration.getDate() + 30);

    const expirationDate = expireAt ? new Date(expireAt) : defaultExpiration;

    if (!title) {
      return res.status(422).json({ error: 'O título não pode ser vazio.' });
    }

    const poll = {
      title,
      expireAt: expirationDate
    };

    await db
      .collection("polls")
      .insertOne(poll);

    console.log(poll)
    res.status(201).send(poll);
  } catch (err) {
    res.status(500).send(err.message);
  }
}
export async function getAllPolls(req, res) {
  try {
    const polls = await db.collection("polls").find().toArray();

    res.json(polls);
  } catch (err) {
    res.status(500).send(err.message);
  }
}
export async function getChoicesByPollId(req, res) {
  const { id } = req.params;
  try {
    const poll = await db
      .collection("polls")
      .findOne({ _id: new ObjectId(id) });


    if (!poll) {
      return res.status(404).json({ error: 'Enquete não encontrada.' });
    }

    const choices = await db
      .collection("choices")
      .find({ pollId: id })
      .toArray();

    res.json(choices);

  } catch (err) {
    res.status(500).send(err.message);
  }
}
export async function getPollResult(req, res) {
  const { id } = req.params;

  const poll = await db
    .collection("polls")
    .findOne({ _id: new ObjectId(id) })

  try {
    const result = await db
      .collection("choices")
      .find({ pollId: id })
      .sort({ votes: -1 })
      .toArray()

    const finalResult =
    {
      _id: result[0]._id,
      title: poll.title,
      expireAt: poll.expireAt,
      result: {
        title: result[0].title,
        votes: result[0].votes
      }
    }

    res.json(finalResult);
  } catch (err) {
    res.status(500).send(err.message);
  }
}