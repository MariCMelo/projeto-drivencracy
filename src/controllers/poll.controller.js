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

    await db.collection("polls").insertOne(poll);

    res.status(201).send(poll);
  } catch (err) {
    res.status(500).send(err.message);
  }
}

export async function getAllPolls(req, res) {
  try {
    const pollId = ObjectId(req.params.pollId);

    const poll = await db.collection("polls").findOne({ _id: pollId });

    if (!poll) {
      return res.status(404).json({ error: 'A pesquisa não foi encontrada.' });
    }

    res.json(poll);
  } catch (err) {
    res.status(500).send(err.message);
  }
}

export async function getChoicesByPollId(req, res) {
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
    res.status(500).send(err.message);
  }
}

export async function getPollResult(req, res) {
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

      let maxVotes = 0;
      let winningChoice = null;
      
      choices.forEach(choice => {
        if (choice.votes > maxVotes) {
          maxVotes = choice.votes;
          winningChoice = choice;
        }
      });
      
      const result = {
        title: winningChoice ? winningChoice.title : null,
        votes: maxVotes
      };

    const pollResult = {
      _id: poll._id,
      title: poll.title,
      expireAt: poll.expireAt,
      result: result
    };

    res.json(pollResult);

  } catch (err) {
    res.status(500).send(err.message);
  }
}