package com.example.birimbahub;

import android.os.Bundle;
import android.util.Log;
import com.getcapacitor.BridgeActivity;
import android.webkit.WebSettings;
import android.webkit.WebView;

public class MainActivity extends BridgeActivity {
    private static final String TAG = "MainActivity";
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        try {
            String ua = WebSettings.getDefaultUserAgent(this);
            Log.i(TAG, "WebView user agent: " + ua);
        } catch (Exception e) {
            Log.i(TAG, "Could not get WebView user agent", e);
        }
    }

    @Override
    public void onBackPressed() {
        // Attempt to dispatch a JS history.back() to the WebView
        try {
            final WebView webView = (WebView) this.bridge.getWebView();
            if (webView != null) {
                final java.util.concurrent.atomic.AtomicBoolean jsHandled = new java.util.concurrent.atomic.AtomicBoolean(false);
                webView.post(() -> webView.evaluateJavascript(
                    "(function(){ try{ if(window.history.length>1){ window.history.back(); return 'handled'; } else { return 'nohistory'; } } catch(e){ return 'error'; } })();",
                    value -> {
                        try {
                            if (value != null) {
                                // value is a JSON string like '"handled"' so strip quotes
                                String v = value.replaceAll("^\"|\"$", "");
                                if ("handled".equals(v)) {
                                    jsHandled.set(true);
                                    Log.i(TAG, "onBackPressed: JS handled navigation");
                                } else {
                                    Log.i(TAG, "onBackPressed: JS returned", new Exception(v));
                                }
                            }
                        } catch (Exception ex) {
                            Log.w(TAG, "onBackPressed: error parsing JS result", ex);
                        }
                    }));
                // wait a small amount then fallback to default behavior if JS didn't handle it
                webView.postDelayed(() -> {
                    if (!jsHandled.get()) {
                        // default behavior: call super to let Android moveTaskToBack
                        MainActivity.super.onBackPressed();
                    } else {
                        Log.i(TAG, "onBackPressed: JS handled, skipping native back");
                    }
                }, 300);
                return;
            }
        } catch (Exception e) {
            // fallback: if anything goes wrong while trying to invoke JS, fall back to default
            Log.w(TAG, "onBackPressed JS dispatch failed, falling back to native back", e);
        }
        super.onBackPressed();
    }
}
