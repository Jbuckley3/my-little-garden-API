const express = require('express')
const passport = require('passport')
const User = require('../models/user')
const Plant = require('../models/plant')
const customErrors = require('../../lib/custom_errors')
const handle404 = customErrors.handle404
const requireOwnership = customErrors.requireOwnership
const removeBlanks = require('../../lib/remove_blank_fields')
const requireToken = passport.authenticate('bearer', { session: false })

const router = express.Router()

// INDEX
// GET /plants
router.get('/plants', (req, res, next) => {
	Plant.find()
		.then((plants) => {
			return plants.map((plant) => plant.toObject())
		})
		// respond with status 200 and JSON of the plants
		.then((plants) => res.status(200).json({ plants: plants }))
		// if an error occurs, pass it to the handler
		.catch(next)
})

// SHOW
// GET /plants/5a7db6c74d55bc51bdf39793
router.get('/plants/:id', requireToken, (req, res, next) => {
	// req.params.id will be set based on the `:id` in the route
	Plant.findById(req.params.id)
		.then(handle404)
		// if `findById` is succesful, respond with 200 and "plant" JSON
		.then((plant) => res.status(200).json({ plant: plant.toObject() }))
		// if an error occurs, pass it to the handler
		.catch(next)
})

// CREATE
// POST /plants
router.post('/plants', requireToken, (req, res, next) => {
	// set owner of new plant to be current user
	req.body.plant.owner = req.user.id

	Plant.create(req.body.plant)
		// respond to succesful `create` with status 201 and JSON of new "plant"
		.then((plant) => {
			res.status(201).json({ plant: plant.toObject() })
		})
		.catch(next)
})

// UPDATE
// PATCH /plants/5a7db6c74d55bc51bdf39793
router.patch('/plants/:id', requireToken, removeBlanks, (req, res, next) => {
	// if the client attempts to change the `owner` property by including a new
	// owner, prevent that by deleting that key/value pair
	delete req.body.plant.owner

	Plant.findById(req.params.id)
		.then(handle404)
		.then((plant) => {
			// pass the `req` object and the Mongoose record to `requireOwnership`
			// it will throw an error if the current user isn't the owner
			requireOwnership(req, plant)

			// pass the result of Mongoose's `.update` to the next `.then`
			return plant.updateOne(req.body.plant)
		})
		// if that succeeded, return 204 and no JSON
		.then(() => res.sendStatus(204))
		// if an error occurs, pass it to the handler
		.catch(next)
})

// DESTROY
// DELETE /plants/5a7db6c74d55bc51bdf39793
router.delete('/plants/:id', requireToken, (req, res, next) => {
	Plant.findById(req.params.id)
		.then(handle404)
		.then((plant) => {
			// throw an error if current user doesn't own `plant`
			requireOwnership(req, plant)
			// delete the plant ONLY IF the above didn't throw
			plant.deleteOne()
		})
		// send back 204 and no content if the deletion succeeded
		.then(() => res.sendStatus(204))
		// if an error occurs, pass it to the handler
		.catch(next)
})

// Routes for favorites
router.post('/addFavorite/:userId/:plantId', async (req, res, next) => {
    try {
      const { userId, plantId } = req.params;
	  const newFav = { id: plantId, }
      const user = await User.findById(userId);
    //   const plant = await Plant.findById(plantId);
        
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Check if the plant is already in favorites to avoid duplicates
      if (!user.favorites.includes(newFav)) {
        user.favorites.push(newFav);
        await user.save();
  
        res.status(200).json({ message: 'Plant added to favorites' });
      } else {
        res.status(400).json({ message: 'Plant is already in favorites' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  
router.get('/favorites/:userId', async (req, res) => {
    try {
      const { userId } = req.params;
      console.log(userId)

      const user = await User.findById(userId).populate('favorites'); 
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.status(200).json(user.favorites); 
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

module.exports = router
