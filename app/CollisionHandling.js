var toDestroy = undefined;
//clock and timer for destruction delay for explosion
var collisionClock = new THREE.Clock();
var collisionTimer = 1;



function handleAsteroids() {

    for (var i = 0; i <= asteroids.length - 2; i++) {

        // Asteroidenkollision
        for (var j = i + 1; j <= asteroids.length - 1; j++) {
            if (collision.intersectSphereOther(asteroidHitBoxes[i],
                asteroidHitBoxes[j])) {
                asteroids[i].collide(asteroids[j], "asteroid", i, j);
            }
        }
        // Kollision mit Player
        for (var j = 0; j <= playerHitBoxes.length - 1; j++) {
            if (collision.intersectSphereShipHitBox(asteroidHitBoxes[i],
                playerHitBoxes[j])) {
                // asteroidHitBySpaceship(i);
                asteroids[i].changeAsteroidDirection(); 
                player.playerHitByAsteroid(i,j);
                
                break;
            }
        }

        /** NICHT LÖSCHEN **/
        // Kollision mit Gegner
         for (var j = 0; j <= enemies.length - 1; j++) {
             for (var k = 0; k <= enemyHitBoxes[j].length - 1; k++) {
                 if (collision.intersectSphereBox(asteroidHitBoxes[i], enemyHitBoxes[j][k])) {
                     // asteroidHitBySpaceship(asteroids[k]);
                     //enemyHitbyAsteroid(enemies[j]);
                     console.log("Dummes Schiff");
                     enemies[j].collide(asteroids[i], "asteroid");
                 }
        
         }
    }
  }
}


function handleProjectiles() {

    // for every projectile
    for (var i = 0; i <= projectiles.length - 1; i++) {

        var projectileSucceded = false;

        // Asteroidentreffer
        if (projectiles[i].name === "Laser") {

            for (var j = 0; j <= asteroidHitBoxes.length - 1; j++) {
                if (collision.intersectPointSphere(projectiles[i].getObjectByName("BoxPoint-50"), asteroidHitBoxes[j]) ||
                            collision.intersectPointSphere(projectiles[i].getObjectByName("BoxPoint-25"), asteroidHitBoxes[j]) ||
                            collision.intersectPointSphere(projectiles[i].getObjectByName("BoxPoint0"), asteroidHitBoxes[j]) ||
                            collision.intersectPointSphere(projectiles[i].getObjectByName("BoxPoint25"), asteroidHitBoxes[j]) ||
                            collision.intersectPointSphere(projectiles[i].getObjectByName("BoxPoint50"), asteroidHitBoxes[j])) {
                    successLaser(i);
                    asteroids[j].collide(projectiles[i], "Laser", j);
                    projectileSucceded = true;
                    break;
                }
            }
        }

        else if (projectiles[i].name === "Rocket") {
            for (var j = 0; j <= asteroidHitBoxes.length - 1; j++) {
                if (collision.intersectPointSphere(projectiles[i].getObjectByName("BoxPoint1"), asteroidHitBoxes[j]) ||
                            collision.intersectPointSphere(projectiles[i].getObjectByName("BoxPoint2"), asteroidHitBoxes[j]) ||
                            collision.intersectPointSphere(projectiles[i].getObjectByName("BoxPoint3"), asteroidHitBoxes[j]) ||
                            collision.intersectPointSphere(projectiles[i].getObjectByName("BoxPoint4"), asteroidHitBoxes[j]) ||
                            collision.intersectPointSphere(projectiles[i].getObjectByName("BoxPoint5"), asteroidHitBoxes[j])) {
                    successRocket(i);
                    toDestroy = j;
                    collisionTimer = 0;
                    asteroids[j].collide(projectiles[i], "Rocket", j);
                    projectileSucceded = true;
                    break;
                }
            }
        }


        else if (projectiles[i].name === "Explosion") {
            for (var j = 0; j <= asteroidHitBoxes.length - 1; j++) {
                if (collision.intersectSphereOther(asteroidHitBoxes[j],
                    projectiles[i])) {
                    asteroids[j].collide(projectiles[i], "Explosion", j);
                }
            }
        }


        else if (projectiles[i].name === "MachineGun") {
            for (var j = 0; j <= asteroidHitBoxes.length - 1; j++) {
                if (collision.intersectPointSphere(projectiles[i].getObjectByName("BoxPoint"), asteroidHitBoxes[j])){
                    successMachineGunBullet(i);
                    asteroids[j].collide(projectiles[i], "MachineGun", j);
                    projectileSucceded = true;
                    break;
                }
            }
        }


        // Collect items via projectiles
        if (projectileSucceded === false) {

            if (projectiles[i].name === "Laser") {

                for (var j = 0; j <= itemHitBoxes.length - 1; j++) {

                    var laserBol = false;

                    for (var k = 0; k <= projectiles[i].children.length - 1; k++) {
                        if (collision.intersectPointBox(projectiles[i].children[k], itemHitBoxes[j])) {
                            laserBol = true;
                            break;
                        }
                    }

                    if (laserBol) {
                        successLaser(i);
                        collected(j);
                        break;
                    }
                }
            }


            else if (projectiles[i].name === "Rocket") {
                for (var j = 0; j <= itemHitBoxes.length - 1; j++) {

                    if (collision.intersectPointBox(projectiles[i].getObjectByName("BoxPoint1"), itemHitBoxes[j]) ||
                           collision.intersectPointBox(projectiles[i].getObjectByName("BoxPoint2"), itemHitBoxes[j]) ||
                           collision.intersectPointBox(projectiles[i].getObjectByName("BoxPoint3"), itemHitBoxes[j]) ||
                           collision.intersectPointBox(projectiles[i].getObjectByName("BoxPoint4"), itemHitBoxes[j]) ||
                           collision.intersectPointBox(projectiles[i].getObjectByName("BoxPoint5"), itemHitBoxes[j])) {

                        // successRocket(i);
                        collected(j);
                        break;
                    }
                }
            }


            else if (projectiles[i].name === "Explosion") {
                for (var j = 0; j <= itemHitBoxes.length - 1; j++) {
                    if (collision.intersectSphereBox(itemHitBoxes[j],
                        projectiles[i])) {
                        collected(j);
                    }
                }
            }


            else if (projectiles[i].name === "MachineGun") {
                for (var j = 0; j <= itemHitBoxes.length - 1; j++) {
                    if (collision.intersectPointBox(projectiles[i].getObjectByName("BoxPoint"), itemHitBoxes[j])) {
                        successMachineGunBullet(i);
                        collected(j);
                        break;
                    }
                }
            }

         for (var j = 0; j < enemies.length - 1; j++) {
           /* var enemyHitboxes = enemies[j].getHitBoxes();
            if (projectiles[i].name === "Laser") {

                for (var j = 0; j <= itemHitBoxes.length - 1; j++) {

                    var laserBol = false;

                    for (var k = 0; k <= projectiles[i].children.length - 1; k++) {
                        if (collision.intersectPointBox(projectiles[i].children[k], itemHitBoxes[j])) {
                            laserBol = true;
                            break;
                        }
                    }

                    if (laserBol) {
                        successLaser(i);
                        collected(j);
                        break;
                    }
                }
            }*/


            var enemyHitboxes = enemies[j].getHitBoxes();
             for (var k = 0; k <= enemyHitBoxes[j].length - 1; k++) {

                if (projectiles[i].name === "Laser") {
                    if (collision.intersectSphereBox(enemyHitboxes[k], projectiles[i])) {
                        successLaser(projectiles[i]);
                        enemyHitByLaser(enemies[j]);
                        console.log("treffer");
                        //enemies[j].collide(asteroids[i], "Laser");
                     }
                 }

                 else if (projectiles[i].name === "EnemyLaser") {
                     if (collision.intersectSphereBox(enemyHitboxes[k], projectiles[i])) {
                         successLaser(projectiles[i]);
                         enemyHitByLaser(enemies[j]);
                     }
                 }

                 else if (projectiles[i].name === "Rocket") {
                     if (collision.intersectSphereBox(enemyHitboxes[k], projectiles[i])) {
                         successRocket(projectiles[i]);
                         console.log("Treffer Rakete");
                    }
                 }

                 else if (projectiles[i].name === "Explosion") {
                     if (collision.intersectSphereBox(projectiles[i], enemyHitboxes[k])) {
                         enemyHitByExplosion(enemyHitboxes[k]);
                         console.log("Treffer explo");
                     }
                 }

                 else if (projectiles[i].name === "MachineGun") {
                     if (collision.intersectSphereBox(projectiles[i], enemyHitboxes[k])) {
                         successMachineGunBullet(projectiles[i]);
                         enemyHitByMachineGun(enemies[j]);
                     }
                 }
             }

         }

        // Player wird getroffen
        // Player kann nicht von den eigenen Projektilen getroffen werden,
        // da diese schneller fliegen (sollen!!!) als der Player selbst
        // var playerHitboxes = getPlayerHitboxes();
        // for (var j = 0; j < getPlayerHitboxes.length - 1; j++) {

        //     if (projectiles[i].name === "Explosion") {
        //         if (intersectSphereOther(getAsteroidHitbox(asteroids[j]),
        //                 projectiles[i])) {
        //             playerHitByExplosion();

        //         }
        //     }

        //     else if (projectiles[i].name === "EnemyLaser") {
        //         if (intersectBoxCylinder(getPlayerHitboxes[j], projectiles[i])) {
        //             successLaser(projectiles[i]);
        //             playerHitByLaser();
        //         }
        //     }

        // }

        }
    }

}

/** NICHT LÖSCHEN **/
function handlePlayerEnemyCollision() {

    // var playerHitboxes = getPlayerHitboxes();
    // for (var i = 0; i <= playerHitboxes.length - 1; i++) {
    //     for (var j = 0; j <= enemies.length; j++) {
    //         var enemyHitboxes = getEnemyHitboxes(enemies[j]);
    //         for (var k = 0; i <= enemyHitboxes.length - 1; k++) {
    //             if (intersectBoxBox(playerHitboxes[i], enemyHitboxes[k])) {
    //                 playerEnemyCollision();
    //                 enemyPlayerCollision(enemies[j]);
    //             }
    //         }
    //     }
    // }

}

/** NICHT LÖSCHEN **/
function handleEnemyEnemyCollision() {

    // for (var i = 0; i <= enemies.length - 2; i++) {
    //     var enemyHitboxes1 = getEnemyHitboxes(enemies[i]); {
    //         for (var j = 0; j < enemyHitboxes1.length; j++) {
    //             for (var k = i+1; k <= enemies.length - 1; k++) {
    //                 var enemyHitboxes2 = getEnemyHitboxes(enemies[k]);
    //                 for (var l = 0; l < enemyHitboxes2.length; l++) {
    //                     if (intersectBoxBox(enemyHitboxes1[j], enemyHitboxes2[l])) {
    //                         enemyEnemyCollision(enemies[i], enemies[k]);
    //                     }
    //                 }
    //             }
    //         }
    //     }
    // }

}


function handlePlayerPopupCollision() {

    for (var i = 0; i < playerHitBoxes.length; i++) {
        for (var j = 0; j < itemHitBoxes.length; j++) {
            if (collision.intersectSphereBox(playerHitBoxes[i],
                itemHitBoxes[j])) {
                collected(j);
            }
        }
    }

}

function handleCollision() {

    collisionTimer += collisionClock.getDelta();
    handlePlayerPopupCollision();
    handleAsteroids();
    handleProjectiles();
    /** NICHT LÖSCHEN **/
    handlePlayerEnemyCollision();
    //handleEnemyEnemyCollision();

    //check if Asteroid needs to be destroyed. Delay between hit and destruction implemented to give explosion time to develop
    if (toDestroy !== undefined && collisionTimer > 1) {
        asteroids[toDestroy].collide(null, "Rocket", toDestroy);
        toDestroy = undefined;
        asteroidAudio.play();
    }

}
