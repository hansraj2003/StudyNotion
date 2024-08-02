import { createCourse, allCourses, getCourseDetails } from "../controllers/Course.js";
import { section, updateSection, deleteSection } from "../controllers/Section.js";
import { subSection, updateSubsection,deleteSubsection } from "../controllers/Subsection.js";
import { category, categoryPageDetails, showAllCategory } from "../controllers/Category.js";
import { createRatingAndReviews, getAllRating, getAverageRating } from "../controllers/RatingAndReview.js";
import { auth, isInstructor, isStudent, isAdmin } from "../middlewares/auth.middleware.js";
import { Router } from "express";

const router = Router()

// **********************************************************************************************************
//                                         Routes for Course
// **********************************************************************************************************

// Course can only be created by instructor
router.post("/create-course", auth, isInstructor, createCourse)

// create section route
router.post("/add-section", auth, isInstructor, section)

// create subsection route
router.post("/add-subsection", auth, isInstructor, subSection)

// update subsection route
router.put("/update-subsection", auth, isInstructor, updateSubsection)

// update section route
router.put("/update-section", auth, isInstructor, updateSection)

router.delete("/delete-subsection", auth, isInstructor, deleteSubsection)

router.delete("/delete-section", auth, isInstructor, deleteSection)

router.get("/getAllCourses", allCourses)

// Get Details for a Specific Courses
router.post("/getCourseDetails", getCourseDetails)

// **********************************************************************************************************
//                                         Category Routes for Admin
// **********************************************************************************************************

router.post("/createCategory", auth, isAdmin, category)
router.get("/showAllCategory", showAllCategory)
router.post("/categoryPageDetails", categoryPageDetails)

// **********************************************************************************************************
//                                       Rating and Reviews Routes
// **********************************************************************************************************

router.post("/createRating", auth, isStudent, createRatingAndReviews)
router.get("/getAverageRating", getAverageRating)
router.get("/getReviews", getAllRating)

export default router;