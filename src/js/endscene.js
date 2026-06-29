import { Actor, Buttons, Color, Font, FontUnit, Keys, Label, Scene, vec, Vector } from "excalibur";
import { Resources } from "./resources";

export class EndScene extends Scene {
    #scoreLabel;
    #leaderboardButton;
    #leaderboardPopup;
    #leaderboardList;
    #comparisonLabel;
    #closeLeaderboardButton;

    onInitialize(engine) {
        this.message = new Label({
            text: 'WELL DONE!',
            pos: new Vector(640, 320),
            font: new Font({
                family: 'Arial',
                size: 74,
                unit: FontUnit.Px,
                color: Color.White
            }),
        })
        // message.graphics.scale = new Vector (3,3)
        this.message.graphics.anchor = new Vector(0.5, 0.5)
        this.add(this.message)

        this.gamepad = engine.gamepad ?? engine.input.gamepads.at(0)



        let hints = new Label({
            text: 'Press [Space] to try again',
            pos: new Vector(640, 50),
            font: new Font({
                family: 'Arial',
                size: 30,
                unit: FontUnit.Px,
                color: Color.White
            }),
        })
        hints.graphics.anchor = new Vector(0.5, 0.5)
        this.add(hints)

        this.scoreLabel = new Label({
            text: 'You finished in ... seconds',
            pos: new Vector(640, 400),
            font: new Font({
                family: 'Arial',
                size: 20,
                unit: FontUnit.Px,
                color: Color.White
            }),
        })
        this.scoreLabel.graphics.anchor = new Vector(0.5, 0.5)
        this.add(this.scoreLabel)

        this.setupLeaderboardUi();
    }

    onActivate(ctx) {
        const TimeScore = ctx.engine.timer
        if (TimeScore < 30) {
            this.background = new Actor({ anchor: vec(0, 0), pos: vec(0, 0), width: 1280, height: 720, z: -1 })
            this.background.graphics.use(Resources.Matrix.toSprite())
            this.add(this.background)            
            this.message.text = `HACKER!`
        } else {
            if(this.background) this.background.kill()
            this.message.text = `WELL DONE!`
        }
        this.scoreLabel.text = `You finished in ${TimeScore} seconds!`

        this.saveScore(TimeScore)
        this.updateLeaderboardUi(TimeScore)

    }

    onPreUpdate(engine) {
        if (engine.input.keyboard.wasPressed(Keys.Space) || this.gamepad.isButtonPressed(Buttons.Face4)) {
            // Activeer de grote schoonmaak!
            engine.resetGame();
        }
    }

    onDeactivate() {
        this.cleanupLeaderboardUi();
    }

    setupLeaderboardUi() {
        if (this.#leaderboardButton) {
            return;
        }

        this.#leaderboardButton = document.createElement("button");
        this.#leaderboardButton.type = "button";
        this.#leaderboardButton.textContent = "bekijk leaderboard";
        this.#leaderboardButton.style.position = "absolute";
        this.#leaderboardButton.style.left = "50%";
        this.#leaderboardButton.style.bottom = "40px";
        this.#leaderboardButton.style.transform = "translateX(-50%)";
        this.#leaderboardButton.style.padding = "12px 20px";
        this.#leaderboardButton.style.border = "none";
        this.#leaderboardButton.style.borderRadius = "999px";
        this.#leaderboardButton.style.background = "#ffffff";
        this.#leaderboardButton.style.color = "#111111";
        this.#leaderboardButton.style.fontFamily = "Arial, sans-serif";
        this.#leaderboardButton.style.fontSize = "18px";
        this.#leaderboardButton.style.cursor = "pointer";
        this.#leaderboardButton.style.zIndex = "2000";
        this.#leaderboardButton.addEventListener("click", () => this.toggleLeaderboardPopup());
        document.body.appendChild(this.#leaderboardButton);

        this.#leaderboardPopup = document.createElement("div");
        this.#leaderboardPopup.style.position = "absolute";
        this.#leaderboardPopup.style.left = "50%";
        this.#leaderboardPopup.style.top = "50%";
        this.#leaderboardPopup.style.transform = "translate(-50%, -50%)";
        this.#leaderboardPopup.style.width = "min(420px, calc(100vw - 40px))";
        this.#leaderboardPopup.style.maxHeight = "70vh";
        this.#leaderboardPopup.style.overflow = "auto";
        this.#leaderboardPopup.style.padding = "20px";
        this.#leaderboardPopup.style.borderRadius = "20px";
        this.#leaderboardPopup.style.background = "rgba(10, 10, 10, 0.94)";
        this.#leaderboardPopup.style.border = "1px solid rgba(255,255,255,0.2)";
        this.#leaderboardPopup.style.color = "white";
        this.#leaderboardPopup.style.fontFamily = "Arial, sans-serif";
        this.#leaderboardPopup.style.zIndex = "2001";
        this.#leaderboardPopup.style.display = "none";

        const title = document.createElement("h2");
        title.textContent = "Leaderboard";
        title.style.margin = "0 0 12px";
        title.style.fontSize = "28px";
        this.#leaderboardPopup.appendChild(title);

        this.#comparisonLabel = document.createElement("p");
        this.#comparisonLabel.style.margin = "0 0 14px";
        this.#comparisonLabel.style.fontSize = "18px";
        this.#leaderboardPopup.appendChild(this.#comparisonLabel);

        this.#leaderboardList = document.createElement("ol");
        this.#leaderboardList.style.margin = "0";
        this.#leaderboardList.style.paddingLeft = "24px";
        this.#leaderboardList.style.display = "grid";
        this.#leaderboardList.style.gap = "8px";
        this.#leaderboardPopup.appendChild(this.#leaderboardList);

        this.#closeLeaderboardButton = document.createElement("button");
        this.#closeLeaderboardButton.type = "button";
        this.#closeLeaderboardButton.textContent = "sluiten";
        this.#closeLeaderboardButton.style.marginTop = "18px";
        this.#closeLeaderboardButton.style.padding = "10px 16px";
        this.#closeLeaderboardButton.style.border = "none";
        this.#closeLeaderboardButton.style.borderRadius = "999px";
        this.#closeLeaderboardButton.style.background = "#cfcfcf";
        this.#closeLeaderboardButton.style.color = "#111111";
        this.#closeLeaderboardButton.style.fontFamily = "Arial, sans-serif";
        this.#closeLeaderboardButton.style.fontSize = "16px";
        this.#closeLeaderboardButton.style.cursor = "pointer";
        this.#closeLeaderboardButton.addEventListener("click", () => this.hideLeaderboardPopup());
        this.#leaderboardPopup.appendChild(this.#closeLeaderboardButton);

        document.body.appendChild(this.#leaderboardPopup);
    }

    toggleLeaderboardPopup() {
        if (!this.#leaderboardPopup) {
            return;
        }

        if (this.#leaderboardPopup.style.display === "none") {
            this.#leaderboardPopup.style.display = "block";
        } else {
            this.hideLeaderboardPopup();
        }
    }

    hideLeaderboardPopup() {
        if (this.#leaderboardPopup) {
            this.#leaderboardPopup.style.display = "none";
        }
    }

    cleanupLeaderboardUi() {
        this.hideLeaderboardPopup();

        if (this.#leaderboardButton) {
            this.#leaderboardButton.remove();
            this.#leaderboardButton = null;
        }

        if (this.#leaderboardPopup) {
            this.#leaderboardPopup.remove();
            this.#leaderboardPopup = null;
            this.#leaderboardList = null;
            this.#comparisonLabel = null;
            this.#closeLeaderboardButton = null;
        }
    }

    saveScore(timeScore) {
        const storedScores = this.readScores();
        storedScores.push(Number(timeScore));
        localStorage.setItem("timescore", JSON.stringify(storedScores));
    }

    updateLeaderboardUi(timeScore) {
        if (!this.#leaderboardList || !this.#comparisonLabel) {
            return;
        }

        const scores = this.readScores()
            .map((score) => Number(score))
            .filter((score) => Number.isFinite(score))
            .sort((left, right) => left - right)
            .slice(0, 10);

        this.#leaderboardList.innerHTML = "";

        scores.forEach((score, index) => {
            const item = document.createElement("li");
            item.textContent = `: ${score} sec`;
            if (score === Number(timeScore)) {
                item.style.fontWeight = "700";
                item.style.color = "#7CFF6B";
            }
            this.#leaderboardList.appendChild(item);
        });

        const rankedPosition = this.findRank(Number(timeScore));
        if (rankedPosition === 0) {
            this.#comparisonLabel.textContent = `Jouw tijd: ${timeScore} sec. Nog geen scores om mee te vergelijken.`;
        } else if (rankedPosition <= 10) {
            this.#comparisonLabel.textContent = `Jouw tijd: ${timeScore} sec. Dat is plek #${rankedPosition} in de top 10.`;
        } else {
            const bestScore = scores[0];
            this.#comparisonLabel.textContent = `Jouw tijd: ${timeScore} sec. Beste score nu: ${bestScore} sec.`;
        }
    }

    readScores() {
        try {
            const stored = JSON.parse(localStorage.getItem("timescore") ?? "[]");
            return Array.isArray(stored) ? stored : [];
        } catch {
            return [];
        }
    }

    findRank(timeScore) {
        const scores = this.readScores()
            .map((score) => Number(score))
            .filter((score) => Number.isFinite(score))
            .sort((left, right) => left - right);

        if (scores.length === 0) {
            return 0;
        }

        return scores.findIndex((score) => timeScore <= score) + 1 || scores.length + 1;
    }
}