const express = require("express");
const router = express.Router();

const {
  createCourt,
  getCourts,
  updateCourt,
  deleteCourt,
} = require("../controllers/courtController");

/**
 * @swagger
 * tags:
 *   name: Courts
 *   description: Operations related to Badminton courts
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Court:
 *       type: object
 *       properties:
 *         courtName:
 *           type: string
 *           description: The name of the court
 *         courtType:
 *           type: string
 *           enum: [ADVANCED, INTERMEDIATE, BEGINNERS]
 *           description: The type of the court (ADVANCED, INTERMEDIATE, BEGINNERS)
 *       example:
 *         courtName: "Court A"
 *         courtType: "ADVANCED"
 */

/**
 * @swagger
 * /api/v1/courts:
 *   post:
 *     summary: Create a new court
 *     tags: [Courts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Court'
 *     responses:
 *       201:
 *         description: Court created successfully
 *         content:
 *           application/json:
 *             example:
 *               status: "success"
 *               data:
 *                 court:
 *                   courtName: "Court A"
 *                   courtType: "ADVANCED"
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/v1/courts:
 *   get:
 *     summary: Get all courts
 *     tags: [Courts]
 *     responses:
 *       200:
 *         description: List of courts retrieved successfully
 *         content:
 *           application/json:
 *             example:
 *               status: "success"
 *               data:
 *                 - courtName: "Court A"
 *                   courtType: "ADVANCED"
 *                 - courtName: "Court B"
 *                   courtType: "INTERMEDIATE"
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/v1/courts/{courtId}:
 *   put:
 *     summary: Update a court by ID
 *     tags: [Courts]
 *     parameters:
 *       - in: path
 *         name: courtId
 *         required: true
 *         description: ID of the court to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Court'
 *     responses:
 *       200:
 *         description: Court updated successfully
 *         content:
 *           application/json:
 *             example:
 *               status: "success"
 *               data:
 *                 court:
 *                   courtName: "Updated Court B"
 *                   courtType: "INTERMEDIATE"
 *       400:
 *         description: Bad request, invalid parameters
 *       404:
 *         description: Court not found
 *       500:
 *         description: Internal server error
 *
 *   delete:
 *     summary: Delete a court by ID
 *     tags: [Courts]
 *     parameters:
 *       - in: path
 *         name: courtId
 *         required: true
 *         description: ID of the court to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Court deleted successfully
 *         content:
 *           application/json:
 *             example:
 *               status: "success"
 *               message: "Court deleted successfully"
 *       400:
 *         description: Bad request, invalid parameters
 *       404:
 *         description: Court not found
 *       500:
 *         description: Internal server error
 */

router.post("/courts", createCourt);
router.get("/courts", getCourts);
router.route("/courts/:courtId").delete(deleteCourt).put(updateCourt);

module.exports = router;
