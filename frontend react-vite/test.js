import http from 'k6/http';
import { sleep } from 'k6';

export let options = {
    stages: [
        { duration: '10s', target: 100 },
        { duration: '20s', target: 1000 },
        { duration: '30s', target: 5000 },
        { duration: '30s', target: 10000 },
        { duration: '30s', target: 20000},
        { duration: '30s', target: 50000},
        { duration: '30s', target: 70000},
        { duration: '30s', target: 100000},
    ]
};

export default function () {
    http.get('http://localhost:8080/api/product/all-products');
    sleep(1);
}
