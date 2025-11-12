package com.api.api.helpers;

import java.util.HashMap;
import java.util.Hashtable;
import java.util.Map;
import javax.naming.Context;
import javax.naming.NamingEnumeration;
import javax.naming.directory.*;
import javax.naming.ldap.InitialLdapContext;
import javax.naming.ldap.LdapContext;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class ActiveDirectory {
    @Value("${ad.url}")
    public String AD_URL;

    @Value("${ad.domain}")
    public String DOMAIN;

    @Value("${ad.dn}")
    public String DN;

    @Value("${ad.adminGroup}")
    public String ADMIN_GROUP;
    
    private final JWTUtil jwt;
    
    public ActiveDirectory(JWTUtil jwt) {
        this.jwt = jwt;
    }

    public Map<String, String> authenticate(String username, String password) {
        try {
            Hashtable<String, String> env = new Hashtable<>();
            env.put(Context.INITIAL_CONTEXT_FACTORY, "com.sun.jndi.ldap.LdapCtxFactory");
            env.put(Context.PROVIDER_URL, AD_URL);
            env.put(Context.SECURITY_AUTHENTICATION, "simple");
            env.put(Context.SECURITY_PRINCIPAL, username + "@" + DOMAIN);
            env.put(Context.SECURITY_CREDENTIALS, password);
            env.put(Context.REFERRAL, "follow");

            LdapContext ctx = new InitialLdapContext(env, null);

            Map<String, String> userInfo = getUserInfo(ctx, username);
            userInfo.put("cookie", jwt.generateToken(
                username, 
                userInfo.get("displayName"), 
                userInfo.get("isAdmin")
            ));
            
            ctx.close();

            return userInfo;            
        } catch (Exception e) {
            System.out.println("Error connecting: " + e.getMessage());
            return null;
        }
    }

    public Map<String, String> verifyJWT(String token) {
        return jwt.validateTokenAndRetrieveSubject(token);
    }

    private Map<String, String> getUserInfo(LdapContext ctx, String username) {
        try {
            SearchControls searchControls = new SearchControls();
            searchControls.setSearchScope(SearchControls.SUBTREE_SCOPE);

            String[] attributes = {
                "sAMAccountName",
                "displayName", 
                "mail",
                "memberOf"
            };
            searchControls.setReturningAttributes(attributes);

            String searchFilter = "(sAMAccountName=" + username + ")";
            NamingEnumeration<SearchResult> results = ctx.search(DN, searchFilter, searchControls);

            Map<String, String> userInfo = new HashMap<>();

            if (results.hasMore()) {
                SearchResult result = results.next();
                Attributes attrs = result.getAttributes();

                userInfo.put("username", username);

                if (attrs.get("displayName") != null) {
                    userInfo.put("displayName", attrs.get("displayName").get().toString());
                }
                if (attrs.get("mail") != null) {
                    userInfo.put("email", attrs.get("mail").get().toString());
                }
                if (attrs.get("department") != null) {
                    userInfo.put("department", attrs.get("department").get().toString());
                }
                if (attrs.get("title") != null) {
                    userInfo.put("title", attrs.get("title").get().toString());
                }

                userInfo.put("isAdmin", String.valueOf(isAdmin(attrs)));
            }
            
            return userInfo;            
        } catch (Exception e) {
            System.out.println("Error retrieving user info: " + e.getMessage());
            return null;
        }
    }

    private boolean isAdmin(Attributes attrs) {
        try {
            Attribute memberOf = attrs.get("memberOf");

            if (memberOf != null) {
                NamingEnumeration<?> groups = memberOf.getAll();

                while (groups.hasMore()) {
                    String group = groups.next().toString().toLowerCase();

                    if (
                        group.contains(ADMIN_GROUP)
                    ) {
                        return true;
                    }
                }
            }

            return false;
        } catch (Exception e) {
            System.out.println("Error checking admin: " + e.getMessage());
            return false;
        }
    }
}
