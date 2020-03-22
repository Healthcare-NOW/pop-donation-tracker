def test_health(test_client):
    resp = test_client.get('/api/health')
    assert resp.get_json() == {'message': 'OK'}
