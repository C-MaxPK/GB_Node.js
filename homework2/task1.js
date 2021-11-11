console.log('Record 1');

setTimeout(() => {
    console.log('Record 2');

    Promise.resolve()
        .then(() => {
            setTimeout(() => {
                console.log('Record 3');
                Promise.resolve()
                    .then(() => console.log('Record 4'));		
        });
    });		
});

console.log('Record 5');

Promise.resolve()
    .then(() => {
        Promise.resolve()
            .then(() => console.log('Record 6'));
    });

// Порядок вывода:
// Record 1
// Record 5
// Record 6
// Record 2
// Record 3
// Record 4
