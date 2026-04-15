document.addEventListener("DOMContentLoaded", function () {

    // PERSONAL
    document.getElementById("editPersonalBtn")
        .addEventListener("click", function () {
            document.getElementById("editPersonalModal").style.display = "block";
        });

    document.getElementById("closePersonalBtn")
        .addEventListener("click", function () {
            document.getElementById("editPersonalModal").style.display = "none";
        });


    // SKILLS
    document.getElementById("editSkillsBtn")
        .addEventListener("click", function () {
            document.getElementById("editSkillsModal").style.display = "block";
        });

    document.getElementById("closeSkillsBtn")
        .addEventListener("click", function () {
            document.getElementById("editSkillsModal").style.display = "none";
        });


    // EDUCATION
    document.getElementById("editEducationBtn")
        .addEventListener("click", function () {
            document.getElementById("editEducationModal").style.display = "block";
        });

    document.getElementById("closeEducationBtn")
        .addEventListener("click", function () {
            document.getElementById("editEducationModal").style.display = "none";
        });


    // EXPERIENCE
    document.getElementById("editExperienceBtn")
        .addEventListener("click", function () {
            document.getElementById("editExperienceModal").style.display = "block";
        });

    document.getElementById("closeExperienceBtn")
        .addEventListener("click", function () {
            document.getElementById("editExperienceModal").style.display = "none";
        });

});